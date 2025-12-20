const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const filePath = path.join(process.cwd(), 'data', 'characters.json');
    const characters = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const { id } = req.query;

    const character = characters.find(char => char.id === Number(id));

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.status(200).json(character);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};