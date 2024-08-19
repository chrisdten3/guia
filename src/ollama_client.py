import requests
import json

# Define the correct API endpoint

api_url = "http://127.0.0.1:11434/api/generate"


headers = {"Content-Type": "application/json"}

data = {
    "model": "llama3.1",
    "prompt": "What is the capital of Ghana",
    "stream": False
}

# Define the data you want to send in the request
payload = {
    "prompt": "What is the capital of France?",  # Your input prompt
}

# Send the POST request
response = requests.post(api_url, headers=headers, data=json.dumps(data))

# Check if the request was successful
if response.status_code == 200:
    # Parse and print the response from the API
    response_data = response.json()
    print("Response:", response_data)
else:
    print("Request failed with status code:", response.status_code)
    print("Response:", response.text)
