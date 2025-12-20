const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const projectRoot = path.join(__dirname, '..', '..');
    const dataDir = path.join(projectRoot, 'data');
    const filePath = path.join(dataDir, 'characters.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'File not found',
        filePath,
        fileExists: false
      });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const characters = JSON.parse(fileContents);
    
    const { id, limit, crew, hasFruit } = req.query;
    
    // NEW: Handle single character request
    if (id) {
      const character = characters.find(char => char.id === parseInt(id));
      
      if (!character) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Character with ID ${id} not found`
        });
      }
      
      return res.status(200).json(character);
    }
    
    // Existing: Handle list with filters
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