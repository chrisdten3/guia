import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './submitRepo.css'; // New CSS file for this specific page
import { Context } from '../context';

const SubmitRepo = () => {
    const [repoLink, setRepoLink] = useState('');
    const [message, setMessage] = useState('');
    const { setCurrentRepo } = useContext(Context);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async () => {
        if (repoLink) {
            if (!repoLink.includes('/')) {
                alert('Please enter the repository in the format "owner/repo".');
                return;
            }
            // Simulate submitting the GitHub repo link
            setCurrentRepo(repoLink);
            console.log(`Submitted GitHub Repo: ${repoLink}`);
            setMessage('GitHub repository submitted successfully!');
            // Navigate to the overview page
            navigate('/overview');
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
                    placeholder="Enter GitHub repo in format owner/repo" 
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
