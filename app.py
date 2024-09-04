from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from retriever import retrieve_documents
from reader import get_files_from_github_repo
from database import database_adder
from createOverview import retrieve_overview

app = Flask(__name__)
app.config['DEBUG'] = True
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


"""
1. pass the url to reader and return a json object with the files
2. pass the json object to retriever
3. retriever should return a string
4. format the string as a json object and return it
"""

@app.route("/api/generateOverview", methods=["GET"])
def get_form_overview():
    repo = request.args.get("repo")
    print(f"repo is {repo}")
    #print("hello")
    #repo_json = get_files_from_github_repo(repo)
    #convert the json object to a string
    #repo_string = str(repo_json)
    response = retrieve_overview(repo)
    return jsonify(response)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
    