from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain.evaluation import load_evaluator
from dotenv import load_dotenv
from get_embedding_function import get_embedding_function
from sklearn.metrics.pairwise import cosine_similarity
import openai
import os
import argparse

# Load environment variables. Assumes that project contains .env file with API keys
load_dotenv()
#---- Set OpenAI API key 
# Change environment variable name from "OPENAI_API_KEY" to the name given in 
# your .env file.
try:
    openai_api_key = os.getenv('OPENAI_API_KEY')
except Exception as e:
    print(f"Issue with openAI key setup.")
    openai_api_key = None
    


def parse_arguments():
    """Parse command-line arguments for words to compare."""
    parser = argparse.ArgumentParser(description="Compare the similarity between two words.")
    parser.add_argument("word1", type=str, help="First word to compare.")
    parser.add_argument("word2", type=str, help="Second word to compare.")
    return parser.parse_args()

def evaluate_similarity(vector1:list[float], vector2:list[float]) -> float:
    return cosine_similarity([vector1], [vector2])[0][0]

def embeddingData(embeddingType:str, word1:str, word2:str) -> list[float]:
        embedding_function = get_embedding_function("ollama")
        vector1 = embedding_function.embed_query(word1)
        vector2 = embedding_function.embed_query(word2)
        print(f"Vector length for {word1}: {len(vector1)}")
        print(f"Vector length for {word2}: {len(vector2)}")
        return vector1,vector2

def main():
    # Parse arguments
    args = parse_arguments()
    word1 = args.word1
    word2 = args.word2
    


    # Use openAI special metric if key is available
    if openai_api_key:
        openai.api_key = openai_api_key
        # pairwsie_embedding_distance mode makes a backend call to openAIEmbeddings which needs key
        evaluator = load_evaluator("pairwise_embedding_distance")
        _, _= embeddingData("openai",word1,word2) #mostly to print out vector info, evaluator internal recomputes vectors
        x = evaluator.evaluate_string_pairs(prediction=word1, prediction_b=word2)
        print(f"Comparing with openAIEmbeddings ({word1}, {word2}): {x}")
    else:
        vector1, vector2 = embeddingData("ollama",word1,word2)
        print(f"Similarity: {evaluate_similarity(vector1=vector1,vector2=vector2)}")
        






if __name__ == "__main__":
    main()