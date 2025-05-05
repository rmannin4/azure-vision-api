require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3000;

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/analyze', upload.single('image'), async (req, res) => {
  console.log('Request received');
  
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).send('No image file uploaded');
  }
  
  console.log('File uploaded:', req.file.path);
  
  try {
    // Read file
    const imageBuffer = fs.readFileSync(req.file.path);
    
    console.log('Using Azure endpoint:', process.env.AZURE_VISION_ENDPOINT);
    console.log('Using exact endpoint: https://ai-rmannin42248ai836358025982.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Description,Tags');
    
    // Make request to Azure with hardcoded values that worked in curl
    const response = await axios.post(
      'https://ai-rmannin42248ai836358025982.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Description,Tags',
      imageBuffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': 'GDWeNpkhBNoav38rHeBSxdRYprSHRR0bjMqcpNQFVDZKv3MbeHreJQQJ99BEACHYHv6XJ3w3AAAAACOGakjw'
        }
      }
    );
    
    console.log('Azure response received');
    
    // Send response back
    res.json(response.data);
  } catch (error) {
    console.error('Error details:');
    
    if (error.response) {
      // Azure responded with an error
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
    } else if (error.request) {
      // No response received
      console.error('No response received');
    } else {
      // Something else went wrong
      console.error('Error message:', error.message);
    }
    
    res.status(500).send('Azure Vision API error. Check server logs for details.');
  } finally {
    // Clean up uploaded file
    try {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
        console.log('Temporary file deleted');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
});

app.get('/', (req, res) => {
  res.send('Azure Vision API service is running');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
