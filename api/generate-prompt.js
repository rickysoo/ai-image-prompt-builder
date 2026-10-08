// Vercel serverless function for OpenAI API calls
// STAMPX page: keep every element (Subject, Task/Action, Aesthetic/Style, Mood & Lighting,
// Perspective & Framing, eXclusions). The page sends only this flag, never its own instructions.
function stampxMessages(components) {
  return [{
    role: 'system',
    content: `You turn STAMPX components into one clear image prompt that works in ChatGPT, Gemini, DALL-E and Midjourney.

STAMPX: S = Subject (who or what is in the image), T = Task / Action (what is happening), A = Aesthetic / Style (what kind of image it is), M = Mood & Lighting (how it feels and how it is lit), P = Perspective & Framing (shot size, camera angle, composition), X = eXclusions (things that must NOT appear).

Rules:
1. ALWAYS start with "Generate an image:"
2. Include EVERY component you are given. Never drop or replace one.
3. Write one natural, flowing description in simple everyday English, in STAMPX order: subject and action, then style, mood and lighting, then perspective and framing.
4. Put all exclusions together in one final sentence, e.g. "No text or watermark."
5. For realistic photos, prefer natural, candid and unretouched wording. Never add "perfect", "ultra-detailed" or "HDR".
6. Keep it under 350 characters.

Return only the prompt, no explanations.`
  }, {
    role: 'user',
    content: `Write the image prompt using these STAMPX components: ${JSON.stringify(components)}`
  }];
}

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
    const { components, format } = req.body;

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
        messages: format === 'stampx' ? stampxMessages(components) : [{
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
        max_tokens: format === 'stampx' ? 200 : 100,
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