const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // 1. Locate the data file safely
    const projectRoot = process.cwd(); 
    const filePath = path.join(projectRoot, 'data', 'marines.json'); 
    
    // 2. Safety Check
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        error: 'File not found',
        message: 'marines.json does not exist in data folder'
      });
    }
    
    // 3. Read and Parse
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const marines = JSON.parse(fileContents);
    
    const { id, name, rank, affiliation } = req.query;
    
    // 4. Handle Single Marine Request (by ID)
    if (id) {
      const marine = marines.find(m => m.id === parseInt(id));
      if (!marine) {
        return res.status(404).json({ error: 'Marine not found' });
      }
      return res.status(200).json(marine);
    }
    
    // 5. Handle List & Filtering
    let result = [...marines];
    
    // Search by Name
    if (name) {
      result = result.filter(m => 
        m.name.toLowerCase().includes(name.toLowerCase()) || 
        m.roman_name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Filter by Rank (e.g., ?rank=Admiral)
    if (rank) {
      result = result.filter(m => 
        m.rank.toLowerCase().includes(rank.toLowerCase())
      );
    }

    // Filter by Affiliation (e.g., ?affiliation=SWORD)
    if (affiliation) {
      result = result.filter(m => 
        m.affiliation.toLowerCase().includes(affiliation.toLowerCase())
      );
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