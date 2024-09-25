import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import './overview.css';
import ReactFlow, { MiniMap, Controls, Background} from 'react-flow-renderer';

const Overview = () => {
    const { currentRepo } = useContext(Context); 
    const [activeTab, setActiveTab] = useState('hierarchy'); // Track active tab
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [repo, setRepo] = useState({ frontend_files: [], backend_files: []});

    useEffect(() => {
        const getOverview = async () => {
            try {
                const [owner, repo] = currentRepo.split('/');
                
                const response = await fetch(`http://localhost:5001/api/github/repo/files?owner=${owner}&repo=${repo}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();

                const files = data['files'];
                console.log('Files:', files);

                const segmentedRepo = segmentFiles(files);
                setRepo(segmentedRepo);

                const currentDependencies = findDependencies(files); 

                const { nodes, edges } = buildNodes(currentDependencies);
                setNodes(nodes);
                setEdges(edges);

                console.log('Nodes:', nodes);
                console.log('Edges:', edges);
                
            } catch (error) {
                console.error('Error:', error);
            }
        };

const segmentFiles = (files) => {
    const frontendExtensions = ['js', 'html', 'css', 'ts', 'jsx', 'tsx'];
    const backendExtensions = ['py', 'java', 'rb', 'php', 'go'];

    const segmentedRepo = { frontend_files: [], backend_files: [] };

    files.forEach(file => {
        const fileExtension = file.file_name.split('.').pop().toLowerCase();

        if (frontendExtensions.includes(fileExtension)) {
            segmentedRepo.frontend_files.push(file);
        } else if (backendExtensions.includes(fileExtension)) {
            segmentedRepo.backend_files.push(file);
        } else {
            console.log(`Uncategorized file: ${file.file_name}`);
        }
    });

    return segmentedRepo;
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

        const extractJsonFromString = (str) => {
            try {
                const jsonString = str.match(/\{[\s\S]*\}/);
                return jsonString ? JSON.parse(jsonString[0]) : null;
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                return null;
            }
        };

        const buildNodes = (data) => {
            const nodes = [];
            const edges = [];
        
            let xOffset = 100;
            let yOffset = 100;
            const xStep = 200;  // horizontal distance between nodes
            const yStep = 100;  // vertical distance between nodes
        
            Object.keys(data).forEach((key, index) => {
                if (key) {
                    nodes.push({
                        id: key,
                        data: { label: data[key].file_name },
                        position: { x: xOffset + (index % 5) * xStep, y: yOffset + Math.floor(index / 5) * yStep }
                    });
                }
        
                // Create edges for dependencies
                data[key].dependencies.forEach(dep => {
                    const targetKey = Object.keys(data).find(k => data[k].file_name === dep);
                    if (targetKey) {
                        edges.push({
                            id: `e-${key}-${targetKey}`,
                            source: key,
                            target: targetKey,
                        });
                    }
                });
            });
            return { nodes, edges };
        };
        

        getOverview();
    }, []);

    return (
        <div className='overview-page'>
            <div className="overview-container">
                <div className="repo-header">
                    <h2>{currentRepo}</h2>
                </div>

                <div className="file-sections">
                    <div className="file-section">
                        <h3>frontend</h3>
                        <div className="file-list">
                            {repo.frontend_files.map((file, index) => (
                                <p key={index}>{file.file_name}</p>
                            ))}
                        </div>
                    </div>

                    <div className="file-section">
                        <h3>backend</h3>
                        <div className="file-list">
                            {repo.backend_files != null ? (
                                repo.backend_files.map((file, index) => (
                                    <p key={index}>{file.file_name}</p>
                                ))
                            ) : (
                                <p>No backend files</p>
                            )}
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
                        Hierarchy
                    </button>
                    <button onClick={() => setActiveTab('assistant')} className={activeTab === 'assistant' ? 'active' : ''}>
                        Assistant
                    </button>
                </div>
                {activeTab === 'learner' && (
                    <div>
                        <h3>Learner View</h3>
                        <p>This section contains learner-specific content...</p>
                    </div>
                )}
                {activeTab === 'hierarchy' && (
                    <div>
                        <h3>Hierarchy View</h3>
                        <p>This section contains hierarchy-specific content...</p>
                        <ReactFlow 
                            nodes={nodes} 
                            edges={edges} 
                            style={{ width: '100%', height: '65vh' }}>
                        </ReactFlow>
                    </div>
                )}

                {activeTab === 'assistant' && (
                    <div>
                        <h3>Assistant View</h3>
                        <p>This section contains assistant-specific content...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;
