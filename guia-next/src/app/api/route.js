import axios from 'axios';  // Import axios for HTTP requests

//const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // Ensure your token is available as an env variable
const GITHUB_TOKEN = process.env.token; // Ensure your token is available as an env variable

// Helper function to get file type
const getFileType = (fileName) => fileName.split('.').pop(); 

// Helper function to fetch file content from GitHub
const getFileContent = async (fileUrl) => {
    try {
        const response = await axios.get(fileUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching file content:', error);
        return '';
    }
};

// Recursive function to fetch repository files and contents
const getRepoFilesWithContent = async (owner, repo, path = '') => {
    console.log(`Fetching files in ${owner}/${repo}/${path}`);
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
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
                    file_url: item.html_url,  // Add the file sub-link
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
};

// API route handler function
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const path = searchParams.get('path') || '';

    if (!owner || !repo) {
        return new Response(
            JSON.stringify({ error: 'Missing owner or repo parameter' }),
            { status: 400 }
        );
    }

    try {
        const files = await getRepoFilesWithContent(owner, repo, path);
        return new Response(
            JSON.stringify({
                repository_url: `https://github.com/${owner}/${repo}`,
                files,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching repository files:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch repository files' }),
            { status: 500 }
        );
    }
}
