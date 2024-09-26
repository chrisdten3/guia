import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';
import image from '../assets/abstract-binary-code-white-clean-background-copyspace-left_215274-1167.avif';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="content-container">
        <div className="text-content">
          <h1>Your smartest path to onboarding</h1>
          <p className="subtext">Understand your codebase effortlessly, and onboard developers in record time.</p>
        </div>
        <div className="button-container">
          <Link to="/repo">
            <button className="landing-button">Try a Demo</button>
          </Link>
          <Link to="/aboutus">
            <button className="landing-button contact-button">About Us</button>
          </Link>
        </div>
      </div>
      <div className="graphic-container">
        {/* You can include a background graphic or abstract design */}
      </div>
    </div>
  );
};

export default LandingPage;


