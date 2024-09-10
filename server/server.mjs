// server.js
import fetch from 'node-fetch'; // Import node-fetch as ES Module
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000; // Port number for your server

// grab with token in .env
const GITHUB_TOKEN = process.env.token;

app.use(cors()); // Enable CORS

// Route to fetch GitHub repo files
app.get('/api/github/repo/files', async (req, res) => {
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
});3

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

