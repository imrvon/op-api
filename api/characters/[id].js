const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Fix: Use __dirname to get the correct path relative to this file
    const filePath = path.join(__dirname, '..', '..', 'data', 'characters.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const characters = JSON.parse(fileContents);
    
    const { id } = req.query;
    
    const character = characters.find(char => char.id === parseInt(id));
    
    if (!character) {
      return res.status(404).json({ 
        error: 'Character not found',
        message: `No character with id ${id}` 
      });
    }
    
    res.status(200).json(character);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message
    });
  }
};