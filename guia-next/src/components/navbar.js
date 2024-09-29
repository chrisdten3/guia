'use client'; // Add this at the top to make the component client-side
import React, { useState } from 'react';
import './navbar.css'; // Import the CSS for the NavBar
import Image from 'next/image';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="nav-container">
      <a href="/" className="nav-brand">
      <Image 
            src="/guia.png" 
            alt="Guia logo" 
            width={150} // Set the appropriate width
            height={50} // Set the appropriate height
            className="nav-logo" 
          />
        </a>
        <button className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/aboutus">About</a></li>
          <li><a href="#services">Pricing</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
