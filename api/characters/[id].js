const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'data', 'characters.json');
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
}