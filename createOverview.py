from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from get_embeddings_function import get_embedding_function



PROMPT_TEMPLATE = """
Describe the following coding project according to the following structure and return it in a json structure. Use only the files given in context:

Frontend:
(list all the frontend files)

Backend:
(list all the backend files)

Purpose: 
Describe the inputs and outputs of the project

Microservices:
List all the popular microservices and APIs that the project uses.

{context}
"""

def retrieve_overview(context_text):

    # Prepare the prompt
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text)
    
    # Initialize and use ChatOllama
    model = ChatOllama(
        model="llama3.1",
        temperature=0,
    )
    response_text = model.invoke(prompt)
    
    return response_text.pretty_repr()
