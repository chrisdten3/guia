const fetch = require('node-fetch');

const GITHUB_TOKEN = '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';  // Replace with your GitHub token

async function getRepoFilesWithContent(owner, repo, path = '') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`, 
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        }, 
        mode: 'cors'
    });
    console.log('response code is: ' + response.status)
    if (!response.ok) {
        throw new Error(`Error fetching repo contents: ${response.statusText}`);
    }

    const data = await response.json();
    let files = [];

    for (const item of data) {
        if (item.type === 'file') {
            if (!item.name.match(/\.(md|py|js|ts|html|css|cpp)$/)) {
                continue;
            }
            const fileContent = await getFileContent(item.download_url);
            const fileInfo = {
                file_name: item.name,
                document_type: getFileType(item.name),
                content: fileContent,
                file_url: item.html_url // Add the file sub-link
            };
            files.push(fileInfo);
        } else if (item.type === 'dir') {
            // Recursively get content of subdirectories
            const subFiles = await getRepoFilesWithContent(owner, repo, item.path);
            files = files.concat(subFiles);
        }
    }

    return files;
}

function getFileType(fileName) {
    return fileName.split('.').pop(); // Get the file extension as document type
}

async function getFileContent(fileUrl) {
    const response = await fetch(fileUrl, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });
    if (!response.ok) {
        throw new Error(`Error fetching file content: ${response.statusText}`);
    }
    return await response.text();
}

export async function getFilesFromGithubRepo(githubUrl) {
    // Extract owner and repo name from the URL
    const parts = githubUrl.replace(/\/$/, '').split('/');
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];

    console.log("in repoUtils reading in from: " + githubUrl);
    // Get the list of filtered files and their content
    const files = await getRepoFilesWithContent(owner, repo);

    // Create the final output structure with repo URL and files information
    const outputData = {
        repository_url: githubUrl,
        files: files
    };
    
    return outputData;
}

