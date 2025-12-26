const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Use process.cwd() for safer path resolution (like we did in crews.js)
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, 'data', 'characters.json');
    
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
    
    // 1. UPDATE: Add 'crew_id' to the destructured query parameters
    const { id, limit, crew, hasFruit, crew_id } = req.query;
    
    // Handle single character request
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
    
    // Handle list with filters
    let result = [...characters];
    
    // 2. NEW FILTER: Filter by Crew ID (for the Crew Details page)
    if (crew_id) {
      result = result.filter(char => 
        // Check if character has a crew object AND if the IDs match
        char.crew && char.crew.id === parseInt(crew_id)
      );
    }

    // Existing: Filter by Crew Name (Search)
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