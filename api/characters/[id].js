const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // 1. Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // 2. Resolve path relative to THIS file (__dirname)
  // Folder structure: api/characters/[id].js -> up 2 levels -> data/characters.json
  const filePath = path.join(__dirname, '..', '..', 'data', 'characters.json');

  try {
    // 3. Read Data
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: 'Database file missing' });
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const characters = JSON.parse(fileContents);

    // 4. Get ID (Vercel automatically puts the URL param here)
    const { id } = req.query;

    // 5. Find (Compare as numbers)
    const character = characters.find(char => char.id == id);

    if (!character) {
      return res.status(404).json({ error: 'Character not yet found' });
    }

    res.status(200).json(character);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};