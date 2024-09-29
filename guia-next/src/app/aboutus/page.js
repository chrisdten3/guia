// pages/aboutus.js
import React from 'react';
import './aboutus.css';
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Bryan Boateng',
    email: 'bryankboateng@gmail.com',
    linkedin: 'https://www.linkedin.com/in/bryan-boateng/',
    github: 'https://github.com/bryankboateng',
    imageUrl: '/2026.Boateng.Bryan.01.png', // Use path relative to public
    bio: 'Bryan is a junior at Princeton, pursuing a degree in Electrical and Computer Engineering. He brings a wealth of experience in computer vision, large language models, and automation, having worked at the Princeton Robot Motion Lab.',
  },
  {
    name: 'Christopher Tengey',
    email: 'cdt50@georgetown.edu',
    linkedin: 'https://www.linkedin.com/in/christopher-tengey-12555b24a/',
    github: 'https://github.com/chrisdten3',
    imageUrl: '/1719227847824.jpeg', // Use path relative to public
    bio: 'Christopher is a junior at Georgetown University, double majoring in Computer Science and Mathematics. With prior experience interning at JP Morgan focused on AI and machine learning, he currently manages analytical projects at Hoyalytics.',
  },
  {
    name: 'Ali Zia',
    email: 'az2741@columbia.edu',
    linkedin: 'https://www.linkedin.com/in/ali-zia-columbia/',
    github: 'https://github.com/ziaali455',
    imageUrl: '/1702424937724.jpeg', // Use path relative to public
    bio: 'Ali is a junior at Columbia University studying Computer Science. He has previous internships as a Software Engineer at JP Morgan and as a Machine Learning Engineer at a startup in Brazil, where he focused on natural language processing.',
  }
];

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h2>Meet The Founders</h2>
      <div className="team-profiles">
        {teamMembers.map((member, index) => (
          <div key={index} className="profile-card">
            <Image 
              src={member.imageUrl} 
              alt={member.name} 
              className="profile-image" 
              width={150} 
              height={150} 
              priority // Optional: prioritize loading of images
            />
            <h3>{member.name}</h3>
            <p className="profile-bio">{member.bio}</p>
            <div className="social-links">
              <a href={`mailto:${member.email}`} className="email-link">
                <MdOutlineEmail />
              </a>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                <CiLinkedin />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="github-link">
                <FaGithub />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
