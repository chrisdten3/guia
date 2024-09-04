import requests

github_access_token = "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"


def get_repo_files_with_content(owner, repo, path=""):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents"

    headers = {'Authorization': f'token {github_access_token}'}
    response = requests.get(url, headers=headers)
    #response.raise_for_status()

    files = []
    data = response.json()

    for item in data:
        if item['type'] == 'file':
            if not item['name'].endswith(('.md', '.py', '.js', '.ts', '.html', '.css', '.json', '.yml', '.yaml', '.txt')):
                continue
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

def main(): 
    example_url = 'chrisdten3/charts'
    print(get_files_from_github_repo(example_url))

if __name__ == "__main__":
    main()
