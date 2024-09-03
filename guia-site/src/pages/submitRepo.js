import React, { useContext, useState } from 'react';
import './submitRepo.css'; // New CSS file for this specific page
import { Context } from '../context';

const SubmitRepo = () => {
    const [repoLink, setRepoLink] = useState('');
    const [message, setMessage] = useState('');
    const {currentRepo, setCurrentRepo} = useContext(Context); 

    const handleSubmit = async () => {
        if (repoLink) {
            // Simulate submitting the GitHub repo link
            setCurrentRepo(repoLink)
            //send URL to api
            await fetch('http://localhost:3000/api/repo'); 
            console.log(`Submitted GitHub Repo: ${repoLink}`);
            setMessage('GitHub repository submitted successfully!');
        } else {
            setMessage('Please enter a valid GitHub repository link.');
        }
    };

    return (
        <div className="submit-container">
            <div className="submit-box">
                <h1 className="submit-title">Submit GitHub Repository</h1>
                <input 
                    type="text" 
                    placeholder="Enter GitHub repository link" 
                    className="submit-input" 
                    value={repoLink}
                    onChange={(e) => setRepoLink(e.target.value)}
                />
                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                {/* Render the submission message here */}
                {message && (
                    <div className="submit-message">
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubmitRepo;
