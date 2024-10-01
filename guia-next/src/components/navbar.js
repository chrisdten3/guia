'use client'; // Add this at the top to make the component client-side
import React, { useState } from 'react';
import './navbar.css'; // Import the CSS for the NavBar
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="nav-container">
        <Link href="/" className="nav-brand"> {/* Use Link instead of anchor tag */}
          <Image 
            src="/guia.png" 
            alt="Guia logo" 
            width={150} // Set the appropriate width
            height={50} // Set the appropriate height
            className="nav-logo" 
          />
        </Link>
        <button className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link href="/landing">Home</Link></li>
          <li><Link href="/aboutus">About</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;