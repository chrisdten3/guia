// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';


import './landingPage.css'; // Create this CSS file for styling

const LandingPage = () => {
  return (
    <div className="landing-page">
    <div ><h1>Welcome to Guia</h1>
    <h2>A smarter codebase.</h2></div>
      
      <div className="button-container">
        <Link to="/home">
          <button className="landing-button">Go to GuiaBot</button>
        </Link>
        <Link to="/code-reader">
          <button className="landing-button">Go to Code Reader</button>
        </Link>
        <Link to="/repo">
          <button className="landing-button">Submit a Repo</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
