// AboutUs.js
import React from 'react';
import './aboutus.css';
import chrisImage from '../assets/1719227847824.jpeg'; 
import aliImage from '../assets/1702424937724.jpeg'
import moImage from '../assets/1727191368290.jpeg'
import bryanImage from '../assets/2026.Boateng.Bryan.01.png'
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const teamMembers = [
  {
    name: 'Bryan Boateng',
    email: 'bryankboateng@gmail.com',
    linkedin: 'https://www.linkedin.com/in/bryan-boateng/',
    github: 'https://github.com/bryankboateng',
    imageUrl: bryanImage, 
  },
  {
    name: 'Christopher Tengey',
    email: 'cdt50@georgeton.edu',
    linkedin: 'https://www.linkedin.com/in/christopher-tengey-12555b24a/',
    github: 'https://github.com/chrisdten3',
    imageUrl: chrisImage,
  },
  {
    name: 'Ali Zia',
    email: 'az2741@columbia.edu',
    linkedin: 'https://www.linkedin.com/in/ali-zia-columbia/',
    github: 'https://github.com/ziaali455',
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
