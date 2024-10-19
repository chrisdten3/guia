import os
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from sentence_transformers import CrossEncoder
from langchain import LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from sentence_transformers import CrossEncoder
from langchain.schema import Document
from langchain_community.document_transformers import LongContextReorder
import json
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_nomic import NomicEmbeddings
import boto3
from langchain import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_core.prompt_values import StringPromptValue
from langchain.llms.bedrock import Bedrock
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from botocore.config import Config

retry_config = Config(
        region_name = 'us-east-1',
        retries = {
            'max_attempts': 10,
            'mode': 'standard'
        }
)



llm = Bedrock(
        model_id="meta.llama3-8b-instruct-v1:0",
        client=boto3.client('bedrock-runtime', region_name='us-east-1'),
        model_kwargs={"top_p": 0, "temperature": 0}  # Remove frequency_penalty and presence_penalty
    )

class Lesson:
    def __init__(self, title: str, lesson_duration: int, sources: list[str]):
        self.title = title
        self.lesson_duration = lesson_duration
        self.sources = sources
        self.questions = []

    def add_question(self, question: dict):
        """Add a question to the lesson"""
        self.questions.append(question)

    def __repr__(self):
        return (f"Lesson(title={self.title}, lesson_duration={self.lesson_duration}, "
                f"sources={self.sources}, questions={len(self.questions)})")


class MultipleChoiceQuestion:
    def __init__(self, question: str, options: dict, correct_answer: str, rationales: dict):
        self.question = question
        self.options = options
        self.correct_answer = correct_answer
        self.rationales = rationales

    def __repr__(self):
        return f"MCQ(question={self.question}, correct_answer={self.correct_answer})"


class FreeResponseQuestion:
    def __init__(self, question: str, answer: str, rationale: str):
        self.question = question
        self.answer = answer
        self.rationale = rationale

    def __repr__(self):
        return f"FRQ(question={self.question}, answer={self.answer})"

class BedrockLLM:
    def __init__(self, model_id):
        self.client = boto3.client('bedrock-runtime', region_name='us-east-1')
        self.model_id = model_id

    def call_bedrock(self, prompt):
        print("model_id: ", self.model_id)
        response = self.client.invoke_model(
            modelId=self.model_id,
            body=json.dumps({
                "prompt": prompt.to_string(),
                "temperature": 0  # Set the temperature to 0
            }),  # Send a dictionary with 'prompt' and 'temperature' keys
            accept='application/json',
            contentType='application/json'
        )
        result = json.loads(response['body'].read())
        return result['generation']

    def __call__(self, prompt, **kwargs):
        return self.call_bedrock(prompt)
    

def get_embedding_function(embeddingType: str):
    """Returns an instance of the embedding class based on the embeddingType."""
    # Dictionary mapping embedding types to their respective classes
    embedding_map = {
        'bedrock': BedrockEmbeddings,
        'ollama': OllamaEmbeddings,
        'openai': OpenAIEmbeddings,
        'nomic':NomicEmbeddings
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
    elif embeddingType == 'nomic':
        return embedding_map[embeddingType](model="nomic-embed-text-v1.5", inference_mode="local")


def prompter(context: str, question: str):
    mcq_str = f"""Based on the following code context and the question, generate **five high-level conceptual multiple-choice questions**.

    Do not include any introductory or concluding text; simply produce the direct output as specified or you will be penalized.

    Avoid repetitive questions or you will be penalized.

    Ask questions on a high level, referencing classes, methods, and packages, focusing on proprietary implementations and paradigms.

    **Output must be valid JSON, without any additional text or formatting.**

    Each question should be formatted as follows:

    {{
        "question": "Multiple choice question you generate based on context",
        "options": {{
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
        }},
        "correct_answer": "A",  // Use "A", "B", "C", or "D" depending on correctness
        "rationales": {{
            "A": "Rationale for option A",
            "B": "Rationale for option B",
            "C": "Rationale for option C",
            "D": "Rationale for option D"
        }}
    }}
    EOU

    Repeat this format for each of the five questions, separating each with the keyword "EOU".

    *Important*:

    - Ensure that your output is **valid JSON** and can be parsed by standard JSON parsers.
    - Do not include any comments, explanations, or extra characters.
    - Properly escape any special characters within strings.

    *Code Context*:
    "{context}"

    *Question to address*:
    "{question}"
    """

    frq_str = f"""Based on the following code context and the question, generate **three high-level conceptual free-response questions with answers and rationales**.

    Do not include any introductory or concluding text; simply produce the direct output as specified or you will be penalized.

    Avoid repetitive questions or you will be penalized.

    Ask questions on a high level, referencing classes, methods, and packages, focusing on proprietary implementations and paradigms.

    **Output must be valid JSON, without any additional text or formatting.**

    Each question should be formatted as follows:

    {{
        "question": "Question you generate based on context",
        "answer": "Answer to the generated question",
        "rationale": "Explanation or series of steps that lead to the answer"
    }}
    EOU

    Repeat this format for each of the three questions, separating each with the keyword "EOU".

    *Important*:

    - Ensure that your output is **valid JSON** and can be parsed by standard JSON parsers.
    - Do not include any comments, explanations, or extra characters.
    - Properly escape any special characters within strings.

    *Code Context*:
    "{context}"

    *Question to address*:
    "{question}"
    """

    return [mcq_str, frq_str]


CHROMA_PATH = "chroma"


def load_documents_from_json(file: list) -> list[Document]:
    """Load JSON documents from a JSON file and convert them to LangChain Document objects."""
    documents = []

    for entry in file:
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


def calculate_chunk_ids(chunks: list[Document]) -> list[Document]:
    """Generate unique IDs for document chunks based on their source and page."""
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        chunk.metadata["id"] = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

    return chunks

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

def query_expansion(llm, query):
    QUERY_PROMPT = QUERY_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""You are an AI language model assistant. Your task is to generate five
    different versions of the given user question to retrieve relevant documents from a vector
    database. By generating multiple perspectives on the user question, your goal is to help
    the user overcome some of the limitations of the distance-based similarity search.
    Provide these alternative questions separated by newlines. Only provide the query, no numbering.
    Original question: {question}""",
    )
    llm_chain = QUERY_PROMPT | llm
    print("in query expansion: ", query)
    queries = llm_chain.invoke(query)
    queries = queries.split('\n\n')[1:]
    print(queries)
    return queries

def relevant_embed(embed_function: str, queries: list[str], k: int) -> list[Document]:
    # Initialize Chroma vector store
    vector_store = Chroma(persist_directory=CHROMA_PATH, embedding_function=get_embedding_function(embed_function))
    
    embed_list = []
    
    # Perform similarity search for each query
    for query in queries:
        # Adjust 'k' as needed to prevent large memory issues
        embed_list.extend(vector_store.similarity_search(query, k=min(k, 10)))  # Limit 'k' for testing
    
    # Remove duplicates based on page content and metadata
    unique_contents = set()
    unique_embed = []
    for doc in embed_list:
        doc_id = (doc.page_content, doc.metadata.get('source_id', ''))
        if doc_id not in unique_contents:
            unique_embed.append(doc)
            unique_contents.add(doc_id)
    
    return unique_embed


def rerank_documents(user_question, docs_split, top_k=0):
    # Prepare pairs of (question, document chunk)
    pairs = [(user_question, doc.page_content) for doc in docs_split]
    content = []
    for doc in docs_split:
      doc_content = doc.page_content
      content.append(doc_content)
      pairs.append([user_question, doc_content])

    # Score the pairs

    # Initialize the cross-encoder used by reranker
    cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    scores = cross_encoder.predict(pairs)
    scored_docs = zip(scores, content)
    sorted_docs = sorted(scored_docs, reverse=True)

    # Allow for selection of top k relevant docs
    if (top_k > 0)  and (top_k < len(sorted_docs)):
      reranked_docs = [doc for _, doc in sorted_docs][0:top_k]
    else:
      reranked_docs = [doc for _, doc in sorted_docs]
    # Long context reordering for llm
    reordering = LongContextReorder()
    reordered_docs = reordering.transform_documents(reranked_docs)
    return reordered_docs


def create_context(reordered_docs):
    context = "\n\n---\n\n".join([doc for doc in reordered_docs])
    return context


def generate_teaching_materials(llm, user_question, context):
    # Generate prompts for the context
    prompts = prompter(user_question, context)

    # Create a generic prompt template
    prompt_template = PromptTemplate(
        input_variables=["full_prompt"],
        template="{full_prompt}"
    )

    # Create the chain
    qa_chain = LLMChain(llm=llm, prompt=prompt_template)

    lesson_objects = []
    for prompt in prompts:
        # Run the LLM chain with the generated prompt
        response = qa_chain.run(full_prompt=prompt)
        print(response, "HELP")

        # Extract JSON content from the response
        json_start = response.find('{')
        json_end = response.rfind('}') + 1
        json_str = response[json_start:json_end]

        # Handle multiple JSON objects separated by 'EOU'
        json_objects = json_str.split('EOU')
        print(json_objects)

        for obj in json_objects:
            obj = obj.strip('\n').strip(',')
            if obj:
                try:
                    # Attempt to parse the JSON string
                    lesson_obj = json.loads(obj)
                except json.JSONDecodeError as e:
                    # If parsing fails, print the error and the offending string
                    print(f"Error parsing JSON: {e}")
                    print(f"Offending string: {obj}")
                    # Skip this invalid JSON object and continue to the next
                    continue  # This line is added to skip the invalid object

                lesson_objects.append(lesson_obj)

        # # Since the output is expected to be JSON, we can attempt to parse it
        # try:
        #     # Extract JSON content from the response
        #     json_start = response.find('{')
        #     json_end = response.rfind('}') + 1
        #     json_str = response[json_start:json_end]

        #     # Handle multiple JSON objects separated by 'EOU'
        #     json_objects = json_str.split('EOU')
        #     print(json_objects)

        #     for obj in json_objects:
        #         obj = obj.strip()
        #         if obj:
        #             lesson_obj = json.loads(obj)
        #             lesson_objects.append(lesson_obj)
        # except json.JSONDecodeError as e:
        #     print("Failed to parse JSON:", e)
        #     print("Response was:", response)

    return lesson_objects


def clear_chroma_via_api():
    """Remove all documents from the Chroma database."""
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function("nomic")
    )

    # Get the ids of all the stored documents
    existing_ids = db.get()["ids"]

    if existing_ids:
        db.delete(ids=existing_ids)
        print(f"Deleted {len(existing_ids)} documents from Chroma.")
    else:
        print("No documents found in the Chroma database.")


def create_lesson_from_llm_output(output: list[dict], title: str, lesson_duration: int, sources: list[str]):
    lesson = Lesson(title=title, lesson_duration=lesson_duration, sources=sources)

    for item in output:
        if 'options' in item:  # MCQ
            mcq = MultipleChoiceQuestion(
                question=item['question'],
                options=item['options'],
                correct_answer=item['correct_answer'],
                rationales=item['rationales']
            )
            lesson.add_question(mcq)
        else:  # FRQ
            frq = FreeResponseQuestion(
                question=item['question'],
                answer=item['answer'],
                rationale=item['rationale']
            )
            lesson.add_question(frq)

    return lesson

if __name__ == "__main__":
    print("Running main function")
    # User question
    user_question = "Teach how stock data and information is retrieved from the backend onto the frontend to a junior engineer"
    # Open json file

    clear_chroma_via_api()

    with open("chartsRepo.json",'r') as afile:
      data = json.load(afile)

    # Initialize the LLM
    # llm = OpenAI(model_name="text-davinci-003")
    #llm = BedrockLLM(model_id="meta.llama3-8b-instruct-v1:0")

    # Load and split documents in directory
    documents = load_documents_from_json([data])
    chunks = split_documents(documents)
    add_to_chroma(chunks)

    # Expand queries on user question
    queries = query_expansion(llm, user_question)

    # Retrieve most relevant docs pertaininy to user_question
    doc_split = relevant_embed("nomic", queries,k=5)

    # Initialize the cross-encoder used by reranker
    cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

    # Rerank documents based on the user's question
    docs_sorted = rerank_documents(user_question, doc_split)

    # Create context from ordered documents
    context = create_context(docs_sorted)

    # Generate teaching materials with qa_chain
    lesson_objects = generate_teaching_materials(llm, user_question, context)

    # Output the lesson objects
    # for idx, lesson in enumerate(lesson_objects):
    #     print(f"Lesson {idx+1}:")
    #     print(json.dumps(lesson, indent=2))
    #     print("\n---\n")

    lesson = create_lesson_from_llm_output(
        lesson_objects, title="Server Side Mass Approximation ", lesson_duration=30, sources=["Metadata"]
    )
    print(lesson)
    for q in lesson.questions:
        print(q)





