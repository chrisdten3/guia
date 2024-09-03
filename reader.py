import requests
import json
import argparse

# Replace 'YOUR_GITHUB_TOKEN' with your actual GitHub personal access token
GITHUB_TOKEN = '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'

def get_repo_files_with_content(owner, repo, path=""):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    headers = {'Authorization': f'token {GITHUB_TOKEN}'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    files = []
    data = response.json()

    for item in data:
        if item['type'] == 'file':
            file_name = item['name']
            file_content = get_file_content(item['download_url'])
            file_info = {
                "file_name": file_name,
                "document_type": get_file_type(file_name),
                "content": file_content,
                "file_url": item['html_url']  # Add the file sub-link
            }
            files.append(file_info)
        elif item['type'] == 'dir':
            # Recursively get content of subdirectories
            files.extend(get_repo_files_with_content(owner, repo, path=item['path']))

    return files

def get_file_type(file_name):
    return file_name.split('.')[-1]  # Get the file extension as document type

def get_file_content(file_url):
    response = requests.get(file_url)
    response.raise_for_status()
    return response.text

def get_files_from_github_repo(github_url):
    # Extract owner and repo name from the URL
    parts = github_url.rstrip('/').split('/')
    owner = parts[-2]
    repo = parts[-1]

    # Get the list of filtered files and their content
    files = get_repo_files_with_content(owner, repo)

    # Create the final output structure with repo URL and files information
    output_data = {
        "repository_url": github_url,
        "files": files
    }
    
    return output_data

def main(urls, output_file):
    all_repos_data = []

    for url in urls:
        print(f"Processing {url}")
        repo_data = get_files_from_github_repo(url)
        all_repos_data.append(repo_data)
        
    return all_repos_data

if __name__ == "__main__":
    # List of GitHub repository URLs
    urls = [
        "https://github.com/idurar/idurar-erp-crm",
        "https://github.com/nz-m/SocialEcho",
        "https://github.com/WaftTech/WaftEngine",
        "https://github.com/foyzulkarim/mernboilerplate-antd",
        "https://github.com/ujjalacharya/dhan-gaadi",
        "https://github.com/orifmilod/iCinema",
        "https://github.com/Ujjalzaman/Doctor-Appointment",
        "https://github.com/raj074/mern-social-media",
        "https://github.com/amand33p/reddish",
        "https://github.com/rupomsoft/mern-x",
        "https://github.com/shakilhasan/sabil"
    ]
    
    output_file = "repo_content.json"

    main(urls, output_file)
