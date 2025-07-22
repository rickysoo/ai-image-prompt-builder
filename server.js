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

  // API endpoint for prompt generation
  if (req.url === '/api/generate-prompt' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { components } = JSON.parse(body);
        
        if (!components || !Array.isArray(components)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid components data' }));
          return;
        }

        const API_KEY = process.env.OPENAI_API_KEY;
        
        if (!API_KEY || API_KEY === 'your-actual-openai-api-key-here') {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'OpenAI API key not configured in .env.local' }));
          return;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'system',
              content: `You are an expert at creating clear, readable image prompts that anyone can understand. Transform the user's components into a natural, descriptive sentence.

              Rules:
              1. Write in simple, everyday language that sounds natural when read aloud
              2. Create a complete sentence that flows smoothly from beginning to end
              3. Use descriptive words that paint a clear picture in the reader's mind
              4. Keep it under 150 characters so it's easy to read and use
              5. Make it sound like something a person would actually say to describe a scene
              6. Avoid technical jargon - use plain English instead
              
              Return only the readable prompt, no explanations.`
            }, {
              role: 'user',
              content: `Create a clear, readable image prompt using these components: ${JSON.stringify(components)}. Make it sound natural and descriptive, like you're explaining the image to a friend.`
            }],
            max_tokens: 100,
            temperature: 0.8
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('OpenAI API Error:', data);
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: data.error?.message || 'OpenAI API error' }));
          return;
        }
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error('Unexpected API response structure:', data);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid response from OpenAI API' }));
          return;
        }
        
        const enhancedPrompt = data.choices[0].message.content.trim();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ prompt: enhancedPrompt }));

      } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
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