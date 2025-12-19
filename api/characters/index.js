import characters from '../../data/characters.json';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { limit, crew, hasFruit } = req.query;
  
  let result = [...characters];
  
  // Filter by crew
  if (crew) {
    result = result.filter(char => 
      char.crew?.name.toLowerCase().includes(crew.toLowerCase())
    );
  }
  
  // Filter by fruit
  if (hasFruit === 'true') {
    result = result.filter(char => char.fruit !== null);
  }
  
  // Limit results
  if (limit) {
    result = result.slice(0, parseInt(limit));
  }
  
  res.status(200).json(result);
}