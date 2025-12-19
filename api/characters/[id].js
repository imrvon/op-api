import characters from '../../data/characters.json';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { id } = req.query;
  
  const character = characters.find(char => char.id === parseInt(id));
  
  if (!character) {
    return res.status(404).json({ 
      error: 'Character not found',
      message: `No character with id ${id}` 
    });
  }
  
  res.status(200).json(character);
}