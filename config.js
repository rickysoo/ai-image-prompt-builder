// Client-side configuration
// This file handles environment variables for both local and Vercel deployment

const CONFIG = {
    // For local development, you can temporarily set your API key here
    // But NEVER commit it to git! Use .env.local instead when possible
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 
                   window.ENV?.OPENAI_API_KEY || 
                   'your-api-key-here', // Fallback - replace with your key temporarily for testing
    
    // API endpoints
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    
    // App settings
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 100,
    TEMPERATURE: 0.8
};

// For Vercel deployment, environment variables are injected at build time
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    // Production environment on Vercel
    console.log('Running on Vercel - using environment variables');
}

export default CONFIG;