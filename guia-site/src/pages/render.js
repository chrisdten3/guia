import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';

const initialData = {
  repository_url: "https://github.com/chrisdten3/charts",
  files: [
    {
      file_name: "README.md",
      document_type: "md",
      content: "# Welcome to charts! A financial personal project on exploring portfolios!",
      file_url: "https://github.com/chrisdten3/charts/blob/main/README.md",
      dependencies: []
    },
    {
      file_name: "app.py",
      document_type: "py",
      content: "...",
      file_url: "https://github.com/chrisdten3/charts/blob/main/app.py",
      dependencies: [
        {
          initiator_file: "app.py",
          target_file: "efCalc.py",
          dependency_type: "function_call",
          description: "get_portfolio_allocations() function"
        },
        {
          initiator_file: "app.py",
          target_file: "efCalc.py",
          dependency_type: "function_call",
          description: "get_history() function"
        }
      ]
    },
    {
      file_name: "efCalc.py",
      document_type: "py",
      content: "...",
      file_url: "https://github.com/chrisdten3/charts/blob/main/efCalc.py",
      dependencies: []
    },
    {
      file_name: "server.js",
      document_type: "js",
      content: "...",
      file_url: "https://github.com/chrisdten3/charts/blob/main/server.js",
      dependencies: [
        {
          initiator_file: "server.js",
          target_file: "efCalc.py",
          dependency_type: "data_fetching",
          description: "fetches data from Alpha Vantage API"
        }
      ]
    }
  ]
};

// Helper function to convert data to nodes and edges
const convertToFlowData = (data) => {
  const nodes = [];
  const edges = [];

  // Map files to nodes
  data.files.forEach((file, index) => {
    nodes.push({
      id: file.file_name,
      data: { label: file.file_name },
      position: { x: Math.random() * 500, y: Math.random() * 500 } // Random positioning, adjust as needed
    });

    // Add dependencies as edges
    file.dependencies.forEach((dep) => {
      edges.push({
        id: `${dep.initiator_file}-${dep.target_file}`,
        source: dep.initiator_file,
        target: dep.target_file,
        label: dep.dependency_type,
      });
    });
  });

  return { nodes, edges };
};

const FlowChart = () => {
  const [flowData] = useState(convertToFlowData(initialData));

  return (
    <div style={{ height: '500px' }}>
      <ReactFlow
        nodes={flowData.nodes}
        edges={flowData.edges}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowChart;
