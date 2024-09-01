from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from retriever import retrieve_documents

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["GET"])
def get_response():
    query = request.args.get("query")
    response = retrieve_documents(query)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
    