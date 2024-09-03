from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from retriever import retrieve_documents
from reader import get_files_from_github_repo
from database import database_adder

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["GET"])
def get_response():
    query = request.args.get("query")
    response = retrieve_documents(query)
    return jsonify({"response": response})

@app.route("/api/repo", methods=["POST"])
def send_repo():
    url = request.args.get('url')
    listUrls = get_files_from_github_repo(url)
    database_adder(listUrls)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
    