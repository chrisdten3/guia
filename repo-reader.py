import requests

def read_repo(github_repo_url):

    def get_repo_files_with_content(owner, repo, path=""):
        # Construct the GitHub API URL
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        response = requests.get(url)

        # Raise an error if the request was unsuccessful
        response.raise_for_status()

        files = []
        data = response.json()

        for item in data:
            if item['type'] == 'file':
                file_name = item['name']
                if file_name.endswith(('.md', '.py', '.js')):
                    file_content = get_file_content(item['download_url'])
                    files.append((file_name, file_content))
            elif item['type'] == 'dir':
                # Recursively get content of subdirectories
                files.extend(get_repo_files_with_content(owner, repo, path=item['path']))

        return files

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

        for file_name, file_content in files:
            print(f"File: {file_name}\n")
            print(f"Content:\n{file_content}\n")
            print("=" * 80)

    #github_repo_url = "https://github.com/chrisdten3/charts"
    get_files_from_github_repo(github_repo_url)
