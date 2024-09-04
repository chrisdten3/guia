import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './overview.css';
import { getFilesFromGithubRepo } from '../repoUtils';

function jsonParser(response) {
        // Extract JSON content using regex
    const jsonMatch = response.match(/```([\s\S]*?)```/);
    if (jsonMatch) {
        const jsonContent = jsonMatch[1].trim();
        try {
            // Parse JSON
            const data = JSON.parse(jsonContent);
            // Print formatted JSON
            console.log(JSON.stringify(data, null, 2));
            return data; 
        } catch (e) {
            console.error("Failed to decode JSON:", e);
        }
    } else {
        console.log("No JSON structure found in the response.");
    }
}

const Overview = () => {
    const { currentRepo } = useContext(Context);
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState([]);

    const exampleRepo = {
        "repository_url": "https://github.com/nz-m/SocialEcho",
        "files": [
            {
                "file_name": "index.html",
                "document_type": "htm,l",
                "content": "<html><head><title>Social Echo</title></head><body><h1>Welcome to Social Echo</h1></body></html>",
                "file_url": "https://github.com/nz-m/SocialEcho/blob/main/index.html"
            },
            {
                "file_name": "src/app.js",
                "document_type": "js",
                "content": "console.log('Social Echo App Started');",
                "file_url": "https://github.com/nz-m/SocialEcho/blob/main/src/app.js"
            }
        ]
    };

    useEffect(() => {
        console.log(exampleRepo);
        setFileContents(exampleRepo.files);
        
        const getOverview = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/generateOverview?repo=${encodeURIComponent(JSON.stringify(exampleRepo))}`);
                const data = await response.json();
                console.log(jsonParser(data));
            } catch (error) {
                console.error('Error fetching overview:', error);
            }
        };

        getOverview();
    }, []); // Empty dependency array to run only once

    return (
        <div className="overview-container">
            <div className="overview-box">
                <h1 className="overview-title">Overview of {currentRepo}</h1>
                <h2>{exampleRepo.repository_url}</h2>
                <div className="file-list">
                    {fileContents.map(file => (
                        <div key={file.file_name} className="file">
                            <div className="file-header">
                                <h2>{file.file_name}</h2>
                            </div>
                            <div className="file-content">
                                <SyntaxHighlighter language="javascript" style={solarizedlight}>
                                    {file.content}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    ))}
                </div> 
            </div>
        </div>
    );
}

export default Overview;
