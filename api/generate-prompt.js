// Vercel serverless function for OpenAI API calls
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { components } = req.body;

    if (!components || !Array.isArray(components)) {
      res.status(400).json({ error: 'Invalid components data' });
      return;
    }

    const API_KEY = process.env.OPENAI_API_KEY;
    
    if (!API_KEY || API_KEY === 'your-api-key-here') {
      res.status(500).json({ error: 'OpenAI API key not configured' });
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
          content: `You are an expert at creating clear, readable image prompts that work across all AI platforms (ChatGPT, Gemini, DALL-E, Midjourney, etc.). Transform the user's components into a natural, descriptive sentence.

          Rules:
          1. ALWAYS start with "Generate an image:" to ensure compatibility across all AI tools
          2. Write in simple, everyday language that sounds natural when read aloud
          3. Create a complete sentence that flows smoothly from beginning to end
          4. Use descriptive words that paint a clear picture in the reader's mind
          5. Keep the description under 150 characters so it's easy to read and use
          6. Make it sound like something a person would actually say to describe a scene
          7. Avoid technical jargon - use plain English instead
          
          Return only the complete prompt starting with "Generate an image:", no explanations.`
        }, {
          role: 'user',
          content: `Create a clear, readable image prompt using these components: ${JSON.stringify(components)}. Remember to start with "Generate an image:" and make it sound natural and descriptive, like you're explaining the image to a friend.`
        }],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    const data = await response.json();
    
    // Check for API errors
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
      return;
    }
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response structure:', data);
      res.status(500).json({ error: 'Invalid response from OpenAI API' });
      return;
    }
    
    const enhancedPrompt = data.choices[0].message.content.trim();
    res.status(200).json({ prompt: enhancedPrompt });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}