import argparse
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
from retriever import retrieve_documents

# Set up the prompt template
PROMPT_TEMPLATE = """
You are an AI assistant. Answer the following question in a helpful and informative way based on the context provided.

Context: {context}

Question: {question}
"""

def get_response(question, context):
    # Prepare the prompt with the user's question and retrieved context
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context, question=question)
    
    # Initialize and use the ChatOllama model
    model = ChatOllama(
        model="llama3.1",
        temperature=0.7,  # Adjust temperature for response randomness
    )
    
    # Get the response from the model
    response_text = model.invoke(prompt)
    
    return response_text

def main():
    # Create CLI for input
    parser = argparse.ArgumentParser(description="Get a response from Ollama model 3.1")
    parser.add_argument("question", type=str, help="The question you want to ask.")
    args = parser.parse_args()

    # Retrieve relevant documents
    formatted_response, context = retrieve_documents(args.question)
    print(context)
    
    # If context is provided, get and print the response
    """if context:
        response = get_response(args.question, context)
        print("Response:")
        print(response)
    else:
        print(formatted_response) """

if __name__ == "__main__":
    main()


 
