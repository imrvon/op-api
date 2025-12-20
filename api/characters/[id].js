const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  console.log('=== [id].js Handler Called ===');
  console.log('req.query:', req.query);
  console.log('id param:', req.query.id);
  
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const filePath = path.join(process.cwd(), 'data', 'characters.json');
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('File read successfully, length:', fileContents.length);
    
    const characters = JSON.parse(fileContents);
    console.log('Characters parsed, count:', characters.length);

    const { id } = req.query;
    console.log('Looking for character with id:', id, 'type:', typeof id);

    const character = characters.find(char => {
      console.log('Comparing:', char.id, '===', Number(id));
      return char.id === Number(id);
    });

    console.log('Character found:', !!character);

    if (!character) {
      console.log('Returning 404');
      return res.status(404).json({ 
        error: 'Character not found',
        requestedId: id,
        availableIds: characters.map(c => c.id)
      });
    }

    console.log('Returning character:', character.name);
    res.status(200).json(character);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ 
      error: err.message,
      stack: err.stack
    });
  }
};