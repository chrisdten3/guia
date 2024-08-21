import argparse
# from dataclasses import dataclass
#from langchain_community.vectorstores import Chroma
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from get_embeddings_function import get_embedding_function

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


def main():
    # Create CLI.
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text

    # Prepare the DB.
    embedding_function = get_embedding_function("nomic")
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_function,
        collection_metadata={"hnsw:space": "cosine"}
    )

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(query_text, k=2)
    res = db.as_retriever(k=1,search_type="similarity_score_threshold", search_kwargs={'score_threshold': 0.3})
    
    if len(results) == 0:
        print("No results found.")
        return

    # Print and analyze results
    for doc, score in results:
        print(f"Document: {doc.page_content}")
        print(f"Score: {score}")

    if results[0][1] < 0.3:
        print(f"Low relevance score: {results[0][1]}")
        return

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    print(prompt)

    # Initialize and use ChatOllama
    model = ChatOllama(
        model="llama3.1",
        temperature=0,
    )
    response_text = model.invoke(prompt)
    
    # Include information about retrieval sources
    sources = [doc.metadata.get("source", None) for doc, _score in results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)

if __name__ == "__main__":
    main()


