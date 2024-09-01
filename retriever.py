from langchain_chroma import Chroma
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from get_embeddings_function import get_embedding_function

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

You are an AI assistant that is an expert in database schema, fullstack projects, and codebases, and development. Answer the following qustion. : {question}
"""

def retrieve_documents(query_text):
    # Prepare the DB.
    embedding_function = get_embedding_function("nomic")
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_function,
        collection_metadata={"hnsw:space": "cosine"}
    )

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(query_text, k=2)
    
    if len(results) == 0:
        return "No results found.", []

    # Filter results by score threshold
    relevant_results = [(doc, score) for doc, score in results if score >= 0.1]

    if len(relevant_results) == 0:
        return "No relevant results found.", []

    # Prepare context from the relevant documents
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in relevant_results])

    # Prepare the prompt
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    
    # Initialize and use ChatOllama
    model = ChatOllama(
        model="llama3.1",
        temperature=0,
    )
    response_text = model.invoke(prompt)
    
    # Include information about retrieval sources
    sources = [doc.metadata.get("source", None) for doc, _score in relevant_results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    return response_text.pretty_repr()






