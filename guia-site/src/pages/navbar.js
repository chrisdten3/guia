import React, { useState } from 'react';
import Guia from '../assets/guia.png'
import './navbar.css'; // Import the CSS for the NavBar

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="nav-container">
      <a href="/" className="nav-brand">
          <img src={Guia} alt="Guia logo" className="nav-logo" /> {/* Add the image here */}
        </a>
        <button className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/aboutus">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
