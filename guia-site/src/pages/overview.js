import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import './overview.css';
import {getFileStructure} from '../test';

const Overview = () => {
    const { currentRepo } = useContext(Context); 
    const [response, setResponse] = useState('');
    const [activeTab, setActiveTab] = useState('learner'); // Track active tab
    const repo = {
        repository_url: "https://github.com/nz-m/SocialEcho",
        frontend_files: [
            { file_name: "main.js" },
            { file_name: "home.js" },
            { file_name: "contact.js" },
            { file_name: "apply.js" },
        ],
        backend_files: [
            { file_name: "UserEntity.java" },
            { file_name: "UserRepositories.java" }
        ],
        microservices: ["AWS", "GCP"]
    };

    useEffect(() => {
        const getOverview = async () => {
            try {
                const [owner, repo] = currentRepo.split('/');
                console.log([owner, repo]); 
                
                const response = await fetch(`http://localhost:5001/api/github/repo/files?owner=${owner}&repo=${repo}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                console.log('API Response:', data);

                const files = data['files'];
                console.log('Files:', files);

                findDependencies(files); 

                //const filesStruct = await getFileStructure(files);

                //console.log('here');

                //console.log('Files Struct:', filesStruct);

                /*const response2 = await fetch('http://localhost:5002/api/github/repo/getStruct', {
                    method: 'POST', // Use POST for sending data
                    headers: { 'Content-Type': 'application/json' },

                  });

                if (!response2.ok) throw new Error(`HTTP error! Status: ${response2.status}`);

                const result = await response2.json();
                console.log('Second API Response:', result); */

            
                /*const response2 = await fetch('https://tprlocupv3.execute-api.us-east-1.amazonaws.com/dev/ask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data }),
                });
            
                if (!response2.ok) throw new Error(`HTTP error! Status: ${response2.status}`);
                
                const result = await response2.json();
                console.log('Second API Response:', result);
                const scrapedData = extractJsonFromString(result);
                setResponse(data); */
                
            } catch (error) {
                console.error('Error:', error);
            }
        };

// Helper function to remove file extensions
function getBaseFileName(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
}

// Function to check if a string contains a file reference
function containsFileReference(content, baseFileName, documentType) {
    const patterns = {
        'py': new RegExp(`\\b(from|import)\\s+${baseFileName}\\b`),
        'ipynb': new RegExp(`\\b(from|import)\\s+${baseFileName}\\b`),
        'js': new RegExp(`\\b(import|require)\\s+.*${baseFileName}\\b`),
        'cpp': new RegExp(`#include\\s+.*${baseFileName}`)
    };

    // Check if there's a language-specific pattern match
    if (patterns[documentType]) {
        return patterns[documentType].test(content);
    }

    // If no language-specific pattern, fall back to basic substring match (for other types of files)
    return content.includes(baseFileName);
}

// Function to find file dependencies within repositories
function findDependencies(files) {
        // Create an object to store dependencies
        let dependencies = {};
        files.forEach(file => {
            try {
                const fileName = file.file_name;
                const content = file.content;
                const documentType = file.document_type;
    
                // Get the base file name (without extension) for comparison
                const baseFileName = getBaseFileName(fileName);
    
                // Initialize dependency list for the current file
                dependencies[baseFileName] = {
                    file_name: fileName,
                    dependencies: []
                };
    
                // Check if any other file's base name is mentioned in the current file's content
                files.forEach(otherFile => {
                    const otherFileName = otherFile.file_name;
                    const otherBaseFileName = getBaseFileName(otherFileName);
                    const otherDocumentType = otherFile.document_type;
    
                    // Check if it's a valid reference based on context (import or include)
                    if (
                        otherBaseFileName !== baseFileName && 
                        containsFileReference(content, otherBaseFileName, documentType)
                    ) {
                        dependencies[baseFileName].dependencies.push(otherFileName);
                    }
                });
            } catch (error) {
                console.log('New Error', error); 
            }

        });

        // Output the dependencies in JSON format
        console.log(JSON.stringify(dependencies, null, 4));
}

        const extractJsonFromString = (str) => {
            try {
                const jsonString = str.match(/\{[\s\S]*\}/);
                return jsonString ? JSON.parse(jsonString[0]) : null;
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                return null;
            }
        };

        getOverview();
    }, []);

    return (
        <div className='overview-page'>
            <div className="overview-container">
                <div className="repo-header">
                    <h2>{currentRepo}</h2>
                </div>

                <div className="file-sections">
                    <div className="file-section">
                        <h3>frontend</h3>
                        <div className="file-list">
                            {repo.frontend_files.map((file, index) => (
                                <p key={index}>{file.file_name}</p>
                            ))}
                        </div>
                    </div>

                    <div className="file-section">
                        <h3>backend</h3>
                        <div className="file-list">
                            {repo.backend_files.length > 0 ? (
                                repo.backend_files.map((file, index) => (
                                    <p key={index}>{file.file_name}</p>
                                ))
                            ) : (
                                <p>No backend files</p>
                            )}
                        </div>
                    </div>

                    <div className="file-section">
                        <h3>microservices</h3>
                        <div className="file-list">
                            {repo.microservices.length > 0 ? (
                                repo.microservices.map((service, index) => (
                                    <p key={index}>{service}</p>
                                ))
                            ) : (
                                <p>No microservices</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="component-box">
                <div className="tab-navigation">
                    <button onClick={() => setActiveTab('learner')} className={activeTab === 'learner' ? 'active' : ''}>
                        Learner
                    </button>
                    <button onClick={() => setActiveTab('hierarchy')} className={activeTab === 'hierarchy' ? 'active' : ''}>
                        Hierarchy
                    </button>
                    <button onClick={() => setActiveTab('assistant')} className={activeTab === 'assistant' ? 'active' : ''}>
                        Assistant
                    </button>
                </div>
                {activeTab === 'learner' && (
                    <div>
                        <h3>Learner View</h3>
                        <p>This section contains learner-specific content...</p>
                    </div>
                )}
                {activeTab === 'hierarchy' && (
                    <div>
                        <h3>Hierarchy View</h3>
                        <p>This section contains hierarchy-specific content...</p>
                    </div>
                )}
                {activeTab === 'assistant' && (
                    <div>
                        <h3>Assistant View</h3>
                        <p>This section contains assistant-specific content...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;
