// server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';  // Import axios for HTTP requests
const app = express();
const PORT = 5001; // Port number for your server

// Grab token from environment variables
const GITHUB_TOKEN = process.env.token;

app.use(cors()); // Enable CORS

app.get('/api/github/repo/files', async (req, res) => {
    const { owner, repo, path = '' } = req.query;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = response.data;
        let files = [];

        for (const item of data) {
            if (item.type === 'file') {
                if (!item.name.match(/\.(md|py|js|ts|html|css|cpp|java)$/)) {
                    continue;
                }

                const fileName = item.name;
                const fileContent = await getFileContent(item.download_url);
                const fileInfo = {
                    file_name: fileName,
                    document_type: getFileType(fileName),
                    content: fileContent,
                    file_url: item.html_url  // Add the file sub-link
                };
                files.push(fileInfo);
            } else if (item.type === 'dir') {
                // Recursively get content of subdirectories
                const subFiles = await getRepoFilesWithContent(owner, repo, item.path);
                files = files.concat(subFiles);
            }
        }

        res.json({ repository_url: `https://github.com/${owner}/${repo}`, files });
    } catch (error) {
        console.error('Error fetching repository files:', error);
        res.status(500).json({ error: 'Failed to fetch repository files' });
    }
});

function getFileType(fileName) {
    return fileName.split('.').pop();  // Get the file extension as document type
}

async function getFileContent(fileUrl) {
    try {
        const response = await axios.get(fileUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching file content:', error);
        return '';
    }
}

async function getRepoFilesWithContent(owner, repo, path = '') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = response.data;
        let files = [];

        for (const item of data) {
            if (item.type === 'file') {
                if (!item.name.match(/\.(md|py|js|ts|html|css|ipynb|cpp|java)$/)) {
                    continue;
                }

                const fileName = item.name;
                const fileContent = await getFileContent(item.download_url);
                const fileInfo = {
                    file_name: fileName,
                    document_type: getFileType(fileName),
                    content: fileContent,
                    file_url: item.html_url  // Add the file sub-link
                };
                files.push(fileInfo);
            } else if (item.type === 'dir') {
                // Recursively get content of subdirectories
                const subFiles = await getRepoFilesWithContent(owner, repo, item.path);
                files = files.concat(subFiles);
            }
        }

        return files;
    } catch (error) {
        console.error('Error fetching repository files:', error);
        return [];
    }
}

// Route to fetch GitHub repo files
/*app.get('/api/github/repo/files', async (req, res) => {
    const { owner, repo, path = '' } = req.query;
    console.log('owner:', owner, 'repo:', repo);

    if (!owner || !repo) {
        return res.status(400).json({ error: 'Missing owner or repo parameter' });
    }

    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        console.log('Request URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        console.log('GitHub API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('GitHub API response error:', errorData);
            throw new Error(`Error fetching repo contents: ${response.statusText}`);
        }

        const data = await response.json();
        let files = [];

        for (const item of data) {
            if (item.type === 'file') {
                if (!item.name.match(/\.(md|py|js|ts|html|css|cpp)$/)) {
                    continue;
                }
                const fileContent = await fetch(item.download_url, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`
                    }
                }).then(res => res.text());
        
                const fileInfo = {
                    file_name: item.name,
                    document_type: item.name.split('.').pop(),
                    content: fileContent,
                    file_url: item.html_url
                };
                files.push(fileInfo);
            } else if (item.type === 'dir') {
                // Recursively get content of subdirectories
                const subFiles = await fetch(`${url}?path=${item.path}`, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`
                    }
                }).then(res => res.json());
        
                // Filter the subFiles by desired file extensions
                const filteredSubFiles = subFiles.filter(subItem => 
                    subItem.type === 'file' && subItem.name.match(/\.(md|py|js|ts|html|css|cpp)$/)
                );
        
                // Now, fetch and process the filtered subFiles
                for (const subItem of filteredSubFiles) {
                    const fileContent = await fetch(subItem.download_url, {
                        headers: {
                            'Authorization': `token ${GITHUB_TOKEN}`
                        }
                    }).then(res => res.text());
        
                    const fileInfo = {
                        file_name: subItem.name,
                        document_type: subItem.name.split('.').pop(),
                        content: fileContent,
                        file_url: subItem.html_url
                    };
                    files.push(fileInfo);
                }
            }
        }

        res.json({
            repository_url: `https://github.com/${owner}/${repo}`,
            files: files
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
}); */

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

