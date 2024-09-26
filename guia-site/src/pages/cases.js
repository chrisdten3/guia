import React from 'react';
import { Link } from 'react-router-dom';
import './cases.css';  // Assuming you have a CSS file for better styling

const Cases = () => {
  return (
    <div className="cases-page">
      <div className="cases-content-container">
        {/* Text Section */}
        <div className="text-content">
          <h1 className="main-title">Choose Your Role</h1>
          <p className="subtext">
            Whether you're managing a team or diving into your workstreams, we offer tools designed specifically to make your onboarding smoother.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="cases-button-container">
          <Link to="/case1">
            <button className="landing-button manager-btn">I am a Manager</button>
          </Link>
          <Link to="/case2">
            <button className="landing-button engineer-btn">I am an Engineer</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cases;
