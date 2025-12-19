const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Debug: Let's see what paths we're working with
    const currentDir = __dirname;
    const projectRoot = path.join(__dirname, '..', '..');
    const dataDir = path.join(projectRoot, 'data');
    const filePath = path.join(dataDir, 'characters.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'File not found',
        currentDir,
        projectRoot,
        dataDir,
        filePath,
        fileExists: false
      });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const characters = JSON.parse(fileContents);
    
    const { limit, crew, hasFruit } = req.query;
    
    let result = [...characters];
    
    if (crew) {
      result = result.filter(char => 
        char.crew?.name.toLowerCase().includes(crew.toLowerCase())
      );
    }
    
    if (hasFruit === 'true') {
      result = result.filter(char => char.fruit !== null);
    }
    
    if (limit) {
      result = result.slice(0, parseInt(limit));
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack
    });
  }
};