import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import './overview.css';


const Overview = () => {

    // Store repo locally for testing
    const {currentRepo} = useContext(Context); 
    const [response, secondResponse] = useState('');
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
                
                // First API call to fetch the repository data
                const response = await fetch(`http://localhost:5001/api/github/repo/files?owner=${owner}&repo=${repo}`);
                
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                // Parse the JSON data from the response
                const data = await response.json();
                
                // Log the response data
                console.log('API Response:', data);
            
                // Prepare the second API call with POST, sending the data in the request body
                const response2 = await fetch('https://tprlocupv3.execute-api.us-east-1.amazonaws.com/dev/ask', {
                    method: 'POST',  // Use POST method
                    headers: {
                        'Content-Type': 'application/json',  // Indicate that the payload is JSON
                    },
                    body: JSON.stringify({ data }),  // Send data in the request body
                });
            
                // Check the second response
                if (!response2.ok) {
                    throw new Error(`HTTP error! Status: ${response2.status}`);
                }
                
                // Parse and log the second API response
                const result = await response2.json();
                console.log('Second API Response:', result);

                scrapedData = extractJsonFromString(result);
                secondResponse(data);
                
            } catch (error) {
                console.error('Error:', error);
            }
        };

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
    }, [currentRepo]); // Add `currentRepo` to dependencies if it changes



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
                    {/* if repopnse show else show loading...*/}
                    {response ? (
                        <div>
                            <h3>Response</h3>
                            <pre>{JSON.stringify(response, null, 2)}</pre>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
        </div>
    );
};

export default Overview;