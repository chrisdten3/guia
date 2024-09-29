'use client'

import React, { useContext, useEffect, useState } from 'react';
import {Context} from '../../context';
import './overview.css';
import ReactFlow from 'react-flow-renderer';


const QuizCard = ({ questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [feedbackShown, setFeedbackShown] = useState(false);
  
    const handleOptionChange = (key) => {
      setSelectedOption(key);
    };
  
    const handleNextQuestion = () => {
      const correctAnswer = questions[currentQuestionIndex].correct_answer;
  
      // If feedback hasn't been shown, show it instead of moving to the next question
      if (!feedbackShown) {
        setIsCorrect(selectedOption === correctAnswer);
        setFeedbackShown(true); // Show feedback once an option is selected
        return;
      }
  
      // If feedback has been shown, proceed to the next question
      if (selectedOption === correctAnswer) {
        setScore(score + 1);
      }
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(''); // Reset selected option for the next question
        setFeedbackShown(false); // Reset feedback for the next question
        setIsCorrect(null); // Reset correctness feedback for the next question
      } else {
        setShowResult(true);
      }
    };
  
    const restartQuiz = () => {
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption('');
      setShowResult(false);
    };
  
    if (showResult) {
      return (
        <div className="quiz-result">
          <h3>Your Score: {score} / {questions.length}</h3>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      );
    }
  
    return (
      <div className="quiz-card">
        <h3>{questions[currentQuestionIndex].question}</h3>
        
        <form>
          {Object.keys(questions[currentQuestionIndex].options).map((key) => (
            <label key={key}>
              <input
                type="radio"
                value={key}
                checked={selectedOption === key}
                onChange={() => handleOptionChange(key)}
                disabled={feedbackShown} // Disable options after feedback is shown
              />
              {key}. {questions[currentQuestionIndex].options[key]}
            </label>
          ))}
        </form>
  
        {feedbackShown && (
          <div className="feedback">
            {isCorrect ? (
              <p className="correct-feedback">Correct! {questions[currentQuestionIndex].rationales[selectedOption]}</p>
            ) : (
              <p className="wrong-feedback">Wrong. {questions[currentQuestionIndex].rationales[selectedOption]}</p>
            )}
          </div>
        )}
  
        <button onClick={handleNextQuestion} disabled={!selectedOption}>
          {feedbackShown ? 'Next Question' : 'Submit Answer'}
        </button>
      </div>
    );
  };


const Overview = () => {
    const { currentRepo } = useContext(Context); 
    const [activeTab, setActiveTab] = useState('hierarchy'); 
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [repo, setRepo] = useState({ frontend_files: [], backend_files: [] });
    const [selectedFile, setSelectedFile] = useState(null); // Track selected file
    const [showDependencies, setShowDependencies] = useState(false); // Toggle dependencies view
    const questions = [{'question': 'What is the purpose of the `errors` variable in the given code?',
        'options': {'A': 'To store successful responses',
         'B': 'To check if all requests were successful',
         'C': 'To extract data from responses',
         'D': 'To handle errors'},
        'correct_answer': 'B',
        'rationales': {'A': 'Incorrect, the `errors` variable is used to store failed requests.',
         'B': 'Correct, the `errors` variable is used to check if all requests were successful and then handle any failures.',
         'C': 'Incorrect, this is not the purpose of the `errors` variable.',
         'D': 'Incorrect, while errors are handled in the code, this is not the primary purpose of the `errors` variable.'}},
       {'question': 'What happens when there are errors in the requests?',
        'options': {'A': 'The data is successfully fetched for all symbols',
         'B': 'An error message is sent to the client with a 500 status code',
         'C': 'The program continues running without any issues',
         'D': 'The server crashes'},
        'correct_answer': 'B',
        'rationales': {'A': 'Incorrect, when there are errors in the requests, an error message is sent to the client with a 500 status code.',
         'B': 'Correct, when there are errors in the requests, an error message is sent to the client with a 500 status code.',
         'C': 'Incorrect, the program does not continue running without any issues when there are errors in the requests.',
         'D': 'Incorrect, the server does not crash when there are errors in the requests.'}},
       {'question': 'What is the purpose of the `data` variable?',
        'options': {'A': 'To store failed responses',
         'B': 'To extract data from successful responses',
         'C': 'To handle errors',
         'D': 'To check if all requests were successful'},
        'correct_answer': 'B',
        'rationales': {'A': 'Incorrect, the `data` variable is used to store data from successful responses.',
         'B': 'Correct, the `data` variable is used to extract data from successful responses.',
         'C': 'Incorrect, this is not the purpose of the `data` variable.',
         'D': 'Incorrect, this is not the purpose of the `data` variable.'}},
       {'question': 'What happens when an error occurs in the code?',
        'options': {'A': 'The program continues running without any issues',
         'B': 'An error message is sent to the client with a 500 status code',
         'C': 'The data is successfully fetched for all symbols',
         'D': 'The server crashes'},
        'correct_answer': 'B',
        'rationales': {'A': 'Incorrect, when an error occurs in the code, an error message is sent to the client with a 500 status code.',
         'B': 'Correct, when an error occurs in the code, an error message is sent to the client with a 500 status code.',
         'C': 'Incorrect, this does not happen when an error occurs in the code.',
         'D': 'Incorrect, the server does not crash when an error occurs in the code.'}},
       {'question': 'What is the purpose of the `app.listen` method?',
        'options': {'A': 'To check if all requests were successful',
         'B': 'To extract data from responses',
         'C': 'To start the server and listen for incoming connections',
         'D': 'To handle errors'},
        'correct_answer': 'C',
        'rationales': {'A': 'Incorrect, this is not the purpose of the `app.listen` method.',
         'B': 'Incorrect, this is not the purpose of the `app.listen` method.',
         'C': 'Correct, the `app.listen` method starts the server and listens for incoming connections.',
         'D': 'Incorrect, this is not the purpose of the `app.listen` method.'}}]
    

    useEffect(() => {
        const getOverview = async () => {
            try {
                //const [owner, repo] = currentRepo.split('/');
                const owner = 'chrisdten3';
                const repo = 'charts';
                const response = await fetch(`/api?owner=${owner}&repo=${repo}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                const files = data['files'];

                const segmentedRepo = segmentFiles(files);
                setRepo(segmentedRepo);

                const currentDependencies = findDependencies(files); 
                const { nodes, edges } = buildNodes(currentDependencies);
                setNodes(nodes);
                setEdges(edges);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        getOverview();
    }, [currentRepo]);

    const segmentFiles = (files) => {
        // Same logic to segment files
        const frontendExtensions = ['js', 'html', 'css', 'ts', 'jsx', 'tsx'];
        const backendExtensions = ['py', 'java', 'rb', 'php', 'go'];

        const segmentedRepo = { frontend_files: [], backend_files: [] };
        files.forEach(file => {
            const fileExtension = file.file_name.split('.').pop().toLowerCase();
            if (frontendExtensions.includes(fileExtension)) {
                segmentedRepo.frontend_files.push(file);
            } else if (backendExtensions.includes(fileExtension)) {
                segmentedRepo.backend_files.push(file);
            }
        });
        return segmentedRepo;
    };

    const buildNodes = (data) => {
        const nodes = [];
        const edges = [];
        let xOffset = 100;
        let yOffset = 100;
        const xStep = 200;
        const yStep = 100;

        Object.keys(data).forEach((key, index) => {
            nodes.push({
                id: key,
                data: { label: data[key].file_name },
                position: { x: xOffset + (index % 5) * xStep, y: yOffset + Math.floor(index / 5) * yStep }
            });

            data[key].dependencies.forEach(dep => {
                const targetKey = Object.keys(data).find(k => data[k].file_name === dep);
                if (targetKey) {
                    edges.push({
                        id: `e-${key}-${targetKey}`,
                        source: key,
                        target: targetKey,
                        animated: true,  // Add this line to enable edge animation
                        style: { stroke: '#f6ab6c' } // Optionally add some custom styling to the edges
                    });
                }
            });
        });

        return { nodes, edges };
    };

    const handleFileClick = (fileName) => {
        const baseFileName = getBaseFileName(fileName); // Get base file name without extension
        setSelectedFile(baseFileName); // Set the selected file's base name
        setShowDependencies(true); // Show dependencies view
    };
    

    const getFilteredNodesAndEdges = () => {
        if (!showDependencies || !selectedFile) return { nodes, edges };

        // Filter nodes and edges to show only the selected file's dependencies
        const baseFileName = selectedFile.split('.').slice(0, -1).join('.');
        const relatedNodes = nodes.filter(node => node.id === baseFileName || edges.some(edge => edge.source === baseFileName || edge.target === baseFileName));
        const relatedEdges = edges.filter(edge => edge.source === baseFileName || edge.target === baseFileName);
        return { nodes: relatedNodes, edges: relatedEdges };
    };


// Helper function to remove file extensions
function getBaseFileName(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
}

// Function to check if a string contains a file reference
function containsFileReference(content, baseFileName, documentType) {
    const patterns = {
        'py': new RegExp(`\\b(from|import)\\s+${baseFileName}\\b`),
        'ipynb': new RegExp(`\\b(from|import)\\s+${baseFileName}\\b`),
        'js': new RegExp(`\\b(import|require)\\s+.*${baseFileName}\\b`),
        'cpp': new RegExp(`#include\\s+.*${baseFileName}`)
    };

    // Check if there's a language-specific pattern match
    if (patterns[documentType]) {
        return patterns[documentType].test(content);
    }

    // If no language-specific pattern, fall back to basic substring match (for other types of files)
    return content.includes(baseFileName);
}

// Function to find file dependencies within repositories
function findDependencies(files) {
        // Create an object to store dependencies
        let dependencies = {};
        files.forEach(file => {
            try {
                const fileName = file.file_name;
                const content = file.content;
                const documentType = file.document_type;
    
                // Get the base file name (without extension) for comparison
                const baseFileName = getBaseFileName(fileName);
    
                // Initialize dependency list for the current file
                dependencies[baseFileName] = {
                    file_name: fileName,
                    dependencies: []
                };
    
                // Check if any other file's base name is mentioned in the current file's content
                files.forEach(otherFile => {
                    const otherFileName = otherFile.file_name;
                    const otherBaseFileName = getBaseFileName(otherFileName);
                    const otherDocumentType = otherFile.document_type;
    
                    // Check if it's a valid reference based on context (import or include)
                    if (
                        otherBaseFileName !== baseFileName && 
                        containsFileReference(content, otherBaseFileName, documentType)
                    ) {
                        dependencies[baseFileName].dependencies.push(otherFileName);
                    }
                });
            } catch (error) {
                console.log('New Error', error); 
            }

        });
        return dependencies;
    }

    const getFilteredGraph = () => {
        // If showDependencies is false, show all nodes and edges
        if (!showDependencies || !selectedFile) {
            return { filteredNodes: nodes, filteredEdges: edges };
        }
    
        // Otherwise, filter nodes and edges to show only the selected file and its dependencies
        const filteredNodes = nodes.filter(node => {
            return node.id === selectedFile || edges.some(edge => edge.source === selectedFile && edge.target === node.id);
        });
    
        const filteredEdges = edges.filter(edge => edge.source === selectedFile || edge.target === selectedFile);
    
        return { filteredNodes, filteredEdges };
    };
    
    

    //const { nodes: filteredNodes, edges: filteredEdges } = getFilteredNodesAndEdges();
    const { filteredNodes, filteredEdges } = getFilteredGraph();

    return (
        <div className='overview-page'>
            <div className="overview-container">
                <div className="repo-header">
                    <h2>chrisdten3/charts</h2>
                </div>

                <div className="file-sections">
                    <div className="file-section">
                        <h3>Frontend</h3>
                        <div className="file-list">
                            {repo.frontend_files.map((file, index) => (
                                <p key={index} onClick={() => handleFileClick(file.file_name)}>
                                    {file.file_name}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="file-section">
                        <h3>Backend</h3>
                        <div className="file-list">
                            {repo.backend_files.map((file, index) => (
                                <p key={index} onClick={() => handleFileClick(file.file_name)}>
                                    {file.file_name}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="component-box">
                <div className="tab-navigation">
                    <button onClick={() => setActiveTab('learner')} className={activeTab === 'learner' ? 'active' : ''}>
                        Learner
                    </button>
                    <button onClick={() => setActiveTab('hierarchy')} className={activeTab === 'hierarchy' ? 'active' : ''}>
                        Roadmap
                    </button>
                    <button onClick={() => setActiveTab('assistant')} className={activeTab === 'assistant' ? 'active' : ''}>
                        Assistant
                    </button>
                </div>
                {activeTab === 'learner' && (
                    <div>
                        <h3>Learner View</h3>
                        <p>This section contains learner-specific content...</p>
                        <div className="learner-content">
                            <QuizCard questions={questions} />
                        </div>
                    </div>
                )}
                {activeTab === 'hierarchy' && (
                    <div>
                        <h3>Roadmap</h3>
                        <button onClick={() => setShowDependencies(!showDependencies)}>
                            {showDependencies ? 'Show All Files' : 'Show Selected File Dependencies'}
                        </button>

                        <ReactFlow 
                            nodes={filteredNodes} 
                            edges={filteredEdges} 
                            style={{ width: '100%', height: '65vh' }}>
                        </ReactFlow>

                    </div>
                )}
                {activeTab === 'assistant' && (
                    <div>
                        <h3>Assistant</h3>
                        <p>Ask Guia questions about how the codebase works.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;