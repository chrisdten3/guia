export const getFileStructure = async (repositories) => {

  const repoStructure = [];

  // Function to classify files and build repo structure
  const classifyAndBuildRepo = async (repositories) => {
    const repoObj = {
        frontend_files: [],
        backend_files: [],
        microservices: []
      };
    for (const repo of repositories) {
        console.log(repo['file_name']);
      // Iterate over files and send to API one by one
        try {
          // Send each file to the classification API
          const response = await fetch('https://tprlocupv3.execute-api.us-east-1.amazonaws.com/dev/ask', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: repo['content'] }), // Ensure the body is stringified
            mode: 'cors'  // Enable CORS
          });

          if (!response.ok) {
            console.error('Error processing file:', repo['file_name'], response.statusText);
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
          console.error('Error processing file:', repo['file_name'], error);
        }
    }
    return repoObj;
  };

  try {
    const result = await classifyAndBuildRepo(repositories);
    return result;
  } catch (error) {
    console.error('Error processing repositories:', error);
  }
};