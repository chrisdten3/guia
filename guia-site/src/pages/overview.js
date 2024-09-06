import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import './overview.css';


const Overview = () => {

    // Store repo locally for testing
    const {currentRepo} = useContext(Context); 
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
                // Make the API call to your server
                const response = await fetch(`http://localhost:5005/api/github/repo/files?owner=${owner}&repo=${repo}`);
                
                // Check if the response is ok (status code 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                // Parse the JSON data from the response
                const data = await response.json();
                
                // Log the response data
                console.log('API Response:', data);
                
            } catch (error) {
                console.error('Error fetching overview:', error);
            }
        };

        getOverview();
    }, [currentRepo]); // Add `currentRepo` to dependencies if it changes



    return (
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
    );
};

export default Overview;