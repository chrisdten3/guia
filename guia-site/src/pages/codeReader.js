import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './codeReader.css';

const CodeReader = () => {
    const [repoLink, setRepoLink] = useState('');
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState({});
    const [expandedFiles, setExpandedFiles] = useState({});
    const [theme, setTheme] = useState('light'); // Default theme is light

    const languageMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'json':'json'
        // Add more mappings as needed
    };

    const getFileLanguage = (filename) => {
        const extension = filename.split('.').pop();
        return languageMap[extension] || 'plaintext'; // Default to plaintext if the extension is not mapped
    };

    const fetchRepoContents = async () => {
        if (!repoLink.includes('/')) {
            alert('Please enter the repository in the format "owner/repo".');
            return;
        }

        try {
            const response = await fetch(`https://api.github.com/repos/${repoLink}/contents`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setFiles(data);
            selectRandomFiles(data);
        } catch (error) {
            console.error("Error fetching repo contents:", error);
        }
    };

    const selectRandomFiles = (fileList) => {
        const files = fileList.filter(file => file.type === 'file'); // Filter only files
        const randomFiles = [];
        
        while (randomFiles.length < 3 && files.length > 0) {
            const randomIndex = Math.floor(Math.random() * files.length);
            const file = files.splice(randomIndex, 1)[0];
            randomFiles.push(file);
        }
        
        randomFiles.forEach(file => fetchFileContent(file));
    };

    const fetchFileContent = async (file) => {
        try {
            const response = await fetch(file.download_url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const content = await response.text();
            setFileContents(prevContents => ({
                ...prevContents,
                [file.name]: content
            }));
            setExpandedFiles(prevState => ({
                ...prevState,
                [file.name]: false // Start with all files collapsed
            }));
        } catch (error) {
            console.error(`Error fetching content for ${file.name}:`, error);
        }
    };

    const handleToggle = (filename) => {
        setExpandedFiles(prevState => ({
            ...prevState,
            [filename]: !prevState[filename]
        }));
    };

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const getSyntaxHighlighterStyle = () => {
        return theme === 'light' ? solarizedlight : dracula;
    };

    return (
        <div className="code-reader-container">
            <h1>Code Reader</h1>
            <input 
                type="text" 
                placeholder="Enter GitHub repo in format owner/repo" 
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                className="repo-input" 
            />
            <button onClick={fetchRepoContents} className="submit-button">Fetch Files</button>
            <div className="theme-selector">
                <label htmlFor="theme">Select Theme: </label>
                <select id="theme" onChange={handleThemeChange} value={theme}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
            <div className="files-container">
                {Object.keys(fileContents).length > 0 && (
                    Object.keys(fileContents).map((filename, index) => (
                        <div key={index} className="file">
                            <h2 onClick={() => handleToggle(filename)} className="file-title">
                                {filename}
                                <span className="toggle-icon">
                                    {expandedFiles[filename] ? '▲' : '▼'}
                                </span>
                            </h2>
                            {expandedFiles[filename] && (
                                <SyntaxHighlighter language={getFileLanguage(filename)} style={getSyntaxHighlighterStyle()}>
                                    {fileContents[filename]}
                                </SyntaxHighlighter>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CodeReader;
