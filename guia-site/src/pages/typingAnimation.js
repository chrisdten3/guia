import React, { useEffect, useState } from 'react';

const TypingAnimation = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let index = 0;

    // Clear previous text before typing
    setDisplayText('');
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index)); // Ensure correct character retrieval
        index++;
      } else {
        clearInterval(intervalId);
        setTimeout(() => {
          setFadeOut(true);
          onComplete(); // Call the onComplete function when finished
        }, 1000); // Wait 1 second before starting to fade out
      }
    }, 50); // Faster typing speed (adjust as needed)

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div className={`typing-animation ${fadeOut ? 'fade-out' : ''}`}>
      {displayText}
    </div>
  );
};

export default TypingAnimation;
