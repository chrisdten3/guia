'use client'
import React from 'react';
import './repo.css'; 

const ManagerWorkflow = () => {
    return (
        <div className="manager-workflow-page">
            <div className="manager-box">
                <h1 className="manager-title">Manager Workflow Coming Soon</h1>
                <h2 className="manager-subtitle">
                    Streamline Onboarding for Your Engineering Teams
                </h2>
                <p className="manager-description">
                    For <strong>Product Managers</strong>, <strong>Senior Software Engineers</strong>, and <strong>Team Leads</strong>, 
                    a powerful new workflow is on its way. You will soon be able to create and assign custom lessons for your codebases to help onboard new engineers more efficiently. 
                    Whether you are managing a small team or an entire organization, our new tools will help ensure that your engineers get up to speed faster, with personalized onboarding material directly related to your projects.
                </p>
                <p className="manager-details">
                    With this feature, you will be able to:
                </p>
                <ul className="manager-list">
                    <li>Create interactive lessons for your engineers based on your codebase.</li>
                    <li>Assign lessons to different engineers based on their experience and project roles.</li>
                    <li>Track onboarding progress and receive feedback for continuous improvement.</li>
                    <li>Reduce onboarding times and improve project efficiency.</li>
                </ul>
                <p className="manager-more-info">
                    Stay tuned for more details, and get ready to streamline your onboarding process like never before!
                </p>
            </div>
        </div>
    );
}

export default ManagerWorkflow;

