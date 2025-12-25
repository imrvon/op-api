const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    // 1. Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // 2. Locate the data file
    const projectRoot = path.join(__dirname, '..');
    const dataDir = path.join(projectRoot, 'data');
    const filePath = path.join(dataDir, 'crews.json'); 
    
    // 3. Safety Check
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'File not found',
        message: 'crews.json does not exist in data folder'
      });
    }
    
    // 4. Read and Parse
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const crews = JSON.parse(fileContents);
    
    const { id, name, is_yonko } = req.query;
    
    // 5. Handle Single Crew Request (by ID)
    if (id) {
      const crew = crews.find(c => c.id === parseInt(id));
      if (!crew) {
        return res.status(404).json({ error: 'Crew not found' });
      }
      return res.status(200).json(crew);
    }
    
    // 6. Handle List & Filtering
    let result = [...crews];
    
    // Filter by name (search)
    if (name) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(name.toLowerCase()) || 
        c.roman_name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Filter by Yonko status (e.g., ?is_yonko=true)
    if (is_yonko === 'true') {
      result = result.filter(c => c.is_yonko === true);
    }
    
    res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};