const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/createFile', (req, res) => {
  console.log('Request Body:', req.body); 
  const { filename, content, password } = req.body;

  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are required' });
  }

  fs.writeFile(path.join(__dirname, `${filename}`), content, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create file' });
    }
    res.status(200).json({ message: 'File created successfully' });
  });
});

app.get('/getFiles', (req, res) => {
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve files' });
    }
    res.status(200).json({ files });
  });
});

app.get('/getFile', (req, res) => {
  const filename = req.query.filename;
  const password = req.query.password;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  

  fs.readFile(path.join(__dirname, filename), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'File not found' });
    }
    res.status(200).json({ content: data });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`);
});