from fastapi import FastAPI, UploadFile, File
from langchain.schema import Document
import json
from test import load_documents_from_json

app = FastAPI()

@app.post("/upload-json")
async def upload_json(json_file: UploadFile = File(...)):
    content = await json_file.read()
    repo_data = json.loads(content)

    # Convert the JSON content into LangChain Document objects
    documents = load_documents_from_json(repo_data)
    
    return {"message": "JSON data processed and added to ChromaDB"}
