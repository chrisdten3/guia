import React, { useEffect, useState } from 'react'; // Import React hooks
import { Link } from 'react-router-dom';
import './landingPage.css';
import guiaImage from '../assets/guia_landing_lesson.png'; // Import the image

const LandingPage = () => {
  const [fadeInText, setFadeInText] = useState(false); // State for text fade-in
  const [fadeOutText, setFadeOutText] = useState(false); // State for text fade-out
  const [showImage, setShowImage] = useState(false); // State to control image visibility
  const [fadeInImage, setFadeInImage] = useState(false); // State for image fade-in

  useEffect(() => {
    setFadeInText(true); // Start fading in the text

    const timer = setTimeout(() => {
      setFadeOutText(true); // Start fading out the text
    }, 3000); // Keep text visible for 3 seconds

    const imageTimer = setTimeout(() => {
      setShowImage(true); // Show the image after text fades out
      setFadeInImage(true); // Start fading in the image
    }, 4000); // Delay showing the image until after text fades out

    return () => {
      clearTimeout(timer);
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <div className="landing-page">
      <div className="content-container">
        <div className="text-content">
          <h1>Your smartest path to onboarding.</h1>
          <p className="subtext">Understand your codebase effortlessly, and onboard developers in record time.</p>
          <div className="button-container">
            <Link to="/cases">
              <button className="landing-button">Try Guia</button>
            </Link>
            <Link to="/aboutus">
              <button className="landing-button">About Us</button>
            </Link>
          </div>
        </div>
      </div>
      {showImage && (
        <div className={`graphic-container ${fadeInImage ? 'fade-in' : ''}`}>
          <img src={guiaImage} alt="Guia Landing Lesson" className="guia-image" />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
