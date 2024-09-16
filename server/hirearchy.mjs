import express from 'express';
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';

// Middleware to parse JSON request body
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to 50MB (you can adjust as needed)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


export default getFileStructure = async (repositories) => {

  const repoStructure = [];
  // Check if repositories exist in the request
  if (!repositories || !Array.isArray(repositories)) {
    return res.status(400).json({ error: 'Invalid request format' });
  }

  // Function to classify files and build repo structure
  const classifyAndBuildRepo = async (repositories) => {
    for (const repo of repositories) {
      const repoObj = {
        repository_url: repo.repository_url,
        frontend_files: [],
        backend_files: [],
        microservices: []
      };

      // Iterate over files and send to API one by one
      for (const file of repo.files) {
        try {
          // Send each file to the classification API
          const response = await fetch('https://tprlocupv3.execute-api.us-east-1.amazonaws.com/dev/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: file.content }) // Send the content of the file
          });

          if (!response.ok) {
            console.error('Error processing file:', file.file_name, response.statusText);
            continue;
          }

          const result = await response.json();
          const { filename, type } = result;

          // Categorize the file based on the response type
          if (type === 'frontend') {
            repoObj.frontend_files.push({ file_name: filename });
          } else if (type === 'backend') {
            repoObj.backend_files.push({ file_name: filename });
          } else if (type === 'microservice') {
            repoObj.microservices.push(filename);
          }
        } catch (error) {
          console.error('Error processing file:', file.file_name, error);
        }
      }

      // Append repo object to the main structure
      repoStructure.push(repoObj);
    }
    return repoStructure;
  };

  try {
    const result = await classifyAndBuildRepo(repositories);
    return res.json(result); // Return the categorized structure
  } catch (error) {
    console.error('Error processing repositories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
