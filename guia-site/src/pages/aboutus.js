// AboutUs.js
import React from 'react';
import './aboutus.css';
import chrisImage from '../assets/1719227847824.jpeg'; 
import aliImage from '../assets/1702424937724.jpeg'
import bryanImage from '../assets/Bryan_Boateng-1.png'
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const teamMembers = [
  {
    name: 'Bryan Boateng',
    email: 'john@example.com',
    linkedin: 'https://www.linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    imageUrl: bryanImage,
  },
  {
    name: 'Christopher Tengey',
    email: 'jane@example.com',
    linkedin: 'https://www.linkedin.com/in/janesmith',
    github: 'https://github.com/janesmith',
    imageUrl: chrisImage,
  },
  {
    name: 'Ali Zia',
    email: 'alex@example.com',
    linkedin: 'https://www.linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    imageUrl: aliImage,
  }
];

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h2>About Us</h2>
      <div className="team-profiles">
        {teamMembers.map((member, index) => (
          <div key={index} className="profile-card">
            <img src={member.imageUrl} alt={member.name} className="profile-image" />
            <h3>{member.name}</h3>
            <div className="social-links">
              <a href={`mailto:${member.email}`} className="email-link"><MdOutlineEmail /></a>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link"><CiLinkedin /></a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="github-link"><FaGithub /></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
