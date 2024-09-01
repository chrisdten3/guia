import argparse
import os
import shutil
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from get_embeddings_function import get_embedding_function
from langchain_community.document_loaders import PyPDFDirectoryLoader, WebBaseLoader
from langchain_chroma import Chroma
import json


CHROMA_PATH = "chroma"
DATA_PATH = "data"

def main():
    parser = argparse.ArgumentParser(description="Manage and update the Chroma database.")
    parser.add_argument("--reset", action="store_true", help="Reset the database before processing.")
    parser.add_argument("--urls", nargs='+', help="List of URLs to load documents from.")
    args = parser.parse_args()

    if args.reset:
        print("✨ Resetting database...")
        clear_database()

    #documents = load_documents(args.urls)
    documents = load_documents_from_json("test_repo_content.json")
    chunks = split_documents(documents)
    add_to_chroma(chunks)

def load_documents_from_json(json_file: str) -> list[Document]:
    """Load JSON documents from a JSON file and convert them to LangChain Document objects."""
    documents = []
    print(f"Loading documents from {json_file}...")

    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        # Ensure the data is a list of repository entries
        if isinstance(data, list):
            for entry in data:
                repo_url = entry.get('repository_url')
                files = entry.get('files', [])
                
                for file_info in files:
                    document = Document(
                        page_content=file_info.get('content'),
                        metadata={
                            'file_name': file_info.get('file_name'),
                            'document_type': file_info.get('document_type'),
                            'file_url': file_info.get('file_url'),
                            'repository_url': repo_url
                        }
                    )
                    documents.append(document)
            return documents
        else:
            print(f"Unexpected JSON structure: {data}")

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except FileNotFoundError:
        print(f"File not found: {json_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

def load_documents(urls: list[str] = None) -> list[Document]:
    """Load PDF documents from a directory and optionally from URLs."""
    documents = []

    # Load PDFs from local directory
    # Make sure pdfs are available in data folder if use
    if os.path.exists(DATA_PATH):
        pdf_loader = PyPDFDirectoryLoader(DATA_PATH)
        documents.extend(pdf_loader.load())

    # Load documents from URLs if provided
    if urls:
        for url in urls:
            web_loader = WebBaseLoader(url)
            documents.extend(web_loader.load())

    return documents

def split_documents(documents: list[Document]) -> list[Document]:
    """Split documents into smaller text chunks."""
    text_splitter = RecursiveCharacterTextSplitter( 
    # Use tiktoken_encoder to split text by token count, ensuring chunks fit model limits. 
    # Use if your model has token constraints; 
    # otherwise, character-based splitting may be enough.
        chunk_size=800,
        chunk_overlap=80,
        length_function=len
    )
    return text_splitter.split_documents(documents)

def add_to_chroma(chunks: list[Document]):
    """Add new document chunks to the Chroma database."""
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function("nomic")
    )

    chunks_with_ids = calculate_chunk_ids(chunks)

    existing_ids = set(db.get()["ids"]) #query database for chunk metadata
    print(f"Existing documents in DB: {len(existing_ids)}")

    #filter out redunndant chunks in new entry
    new_chunks = [chunk for chunk in chunks_with_ids if chunk.metadata["id"] not in existing_ids]

    if new_chunks:
        print(f"👉 Adding {len(new_chunks)} new documents.")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
        #db.persist() ##deprecated
    else:
        print("✅ No new documents to add.")

def calculate_chunk_ids(chunks: list[Document]) -> list[Document]:
    """Generate unique IDs for document chunks based on their source and page.
    Each chunk ID combines the source, page, and a chunk index to ensure uniqueness.
    """
    last_page_id = None  # To keep track of the previous page's ID for indexing
    current_chunk_index = 0  # Index for chunking on the same page

    for chunk in chunks:
        # Extract source and page metadata from the chunk
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        # Create a unique identifier for the current page
        current_page_id = f"{source}:{page}"

        # Check if the current page is the same as the previous one
        if current_page_id == last_page_id:
            current_chunk_index += 1  # Increment index for chunks on the same page
        else:
            current_chunk_index = 0  # Reset index for new pages

        # Assign a unique ID to the chunk combining page ID and chunk index
        chunk.metadata["id"] = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id  # Update last_page_id to current

    return chunks


def clear_database():
    """Remove the existing Chroma database directory."""
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print(f"🗑️  Cleared database at {CHROMA_PATH}.")

if __name__ == "__main__":
    main()

# metdata in chroma.sqlite3 file
# actual embeddings inside .bin files