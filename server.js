const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const port = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoint to get environment variables
  if (req.url === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'not-found'
    }));
    return;
  }

  // Serve static files
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      // Inject environment variables into HTML
      if (extname === '.html' && content) {
        let htmlContent = content.toString();
        
        // Replace the API key placeholder with actual environment variable
        if (process.env.OPENAI_API_KEY) {
          htmlContent = htmlContent.replace(
            "return 'your-api-key-here';",
            `return '${process.env.OPENAI_API_KEY}';`
          );
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(htmlContent, 'utf-8');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Local development server running at http://localhost:${port}/`);
  console.log(`📄 Open http://localhost:${port}/ in your browser`);
  console.log(`🔑 Using API key from .env.local: ${process.env.OPENAI_API_KEY ? '✅ Found' : '❌ Not found'}`);
});