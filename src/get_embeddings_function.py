from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_openai import OpenAIEmbeddings

def get_embedding_function(embeddingType: str):
    """Returns an instance of the embedding class based on the embeddingType."""
    # Dictionary mapping embedding types to their respective classes
    embedding_map = {
        'bedrock': BedrockEmbeddings,
        'ollama': OllamaEmbeddings,
        'openai': OpenAIEmbeddings
    }

    # Check if the provided embeddingType is valid
    if embeddingType not in embedding_map:
        raise ValueError(f"Unknown embedding type: {embeddingType}")

    # Instantiate the appropriate embedding class based on the type
    if embeddingType == 'bedrock':
        return embedding_map[embeddingType](credentials_profile_name="default", region_name="us-east-1")
    elif embeddingType == 'ollama':
        return embedding_map[embeddingType](model="nomic-embed-text")
    elif embeddingType == 'openai':
        return embedding_map[embeddingType]()