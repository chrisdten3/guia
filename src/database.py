import argparse
import os
import shutil
import json
from concurrent.futures import ThreadPoolExecutor
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from get_embeddings_function import get_embedding_function
from langchain_chroma import Chroma
import time
import hashlib

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



    #documents = load_documents()
    documents = load_documents_from_json("repo_content.json")
    chunks = split_documents_parallel(documents)
    add_to_chroma(chunks)


"""

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

    """

def load_documents_from_json(json_file: str) -> list[Document]:
    """Load JSON documents from a JSON file and convert them to LangChain Document objects."""
    documents = []
    print(f"Loading documents from {json_file}...")

    allowed_extensions = ('.js', '.ts', '.py', '.cpp', '.java', '.md', '.ipynb', '.txt')

    try:
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        for entry in data:
            repo_url = entry.get('repository_url')
            files = entry.get('files', [])
            
            for file_info in files:
                file_name = file_info['file_name']

                # Process only files with allowed extensions
                if file_name.endswith(allowed_extensions):
                    document = Document(
                        page_content=file_info['content'],
                        metadata={
                            'file_name': file_name,
                            'document_type': file_info.get('document_type'),
                            'file_url': file_info.get('file_url'),
                            'repository_url': repo_url
                        }
                    )
                    documents.append(document)
        
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading JSON file: {e}")
    
    return documents


def split_documents_parallel(documents: list[Document]) -> list[Document]:
    """Split documents into smaller text chunks using parallel processing."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=5000,
        chunk_overlap=100,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )

    chunks = []
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(text_splitter.split_documents, [doc]) for doc in documents]
        for future in futures:
            chunks.extend(future.result())
    return chunks

def add_to_chroma(chunks: list[Document], batch_size: int = 100):
    """Add new document chunks to the Chroma database in batches with progress tracking."""
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function("nomic")
    )

    chunks_with_ids = calculate_chunk_ids(chunks)
    existing_ids = set(db.get()["ids"])
    print(f"Existing documents in DB: {len(existing_ids)}")

    new_chunks = [chunk for chunk in chunks_with_ids if chunk.metadata["id"] not in existing_ids]
    total_new_chunks = len(new_chunks)

    if total_new_chunks:
        print(f"👉 Adding {total_new_chunks} new documents.")
        
        # Add documents in batches
        for i in range(0, total_new_chunks, batch_size):
            batch_chunks = new_chunks[i:i + batch_size]
            batch_chunk_ids = [chunk.metadata["id"] for chunk in batch_chunks]
            
            db.add_documents(batch_chunks, ids=batch_chunk_ids)
            
            # Print progress
            processed = i + len(batch_chunks)
            print(f"Added {processed}/{total_new_chunks} documents.")
            time.sleep(0.1)  # Optional: Add a small sleep to reduce strain on the DB

        print("✅ All documents added.")

def calculate_chunk_ids(chunks: list[Document]) -> list[Document]:
    """Generate unique IDs for document chunks."""
    for chunk_index, chunk in enumerate(chunks):
        source = chunk.metadata.get("repository_url", "")
        file_name = chunk.metadata.get("file_name", "")
        chunk_content = chunk.page_content

        # Create a unique hash for the chunk content
        content_hash = hashlib.md5(chunk_content.encode('utf-8')).hexdigest()

        # Generate a unique ID using the repository URL, file name, chunk index, and content hash
        chunk.metadata["id"] = f"{source}:{file_name}:{chunk_index}:{content_hash}"

    return chunks


def clear_database():
    """Remove the existing Chroma database directory."""
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print(f"🗑️ Cleared database at {CHROMA_PATH}.")

if __name__ == "__main__":
    main()
