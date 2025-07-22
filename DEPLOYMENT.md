# Deployment Guide

## 🔑 API Key Setup

### For Local Development

1. **Environment file setup (recommended)**
   - Your API key is already in `.env.local` file (git-ignored and secure)
   - Install dependencies: `npm install`
   - Start local server: `npm start`
   - Open: `http://localhost:3000`

2. **Direct file opening (fallback)**
   - If you need to open `index.html` directly in browser
   - Temporarily replace line 806: `return 'your-api-key-here';`
   - With your actual API key
   - **IMPORTANT:** Do NOT commit this change to git!

### For Vercel Deployment

1. **Set Environment Variable in Vercel:**
   ```bash
   # In your Vercel dashboard or CLI:
   vercel env add OPENAI_API_KEY
   # Paste your OpenAI API key when prompted
   ```

2. **Or via Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `OPENAI_API_KEY` = `your-actual-api-key`
   - Apply to: Production, Preview, Development

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🚀 Deployment Steps

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy:**
   ```bash
   vercel login
   cd path/to/your/project
   vercel
   ```

3. **Set Environment Variable:**
   ```bash
   vercel env add OPENAI_API_KEY
   # Enter your OpenAI API key
   ```

4. **Redeploy with Environment Variables:**
   ```bash
   vercel --prod
   ```

### Other Static Hosts

For Netlify, GitHub Pages, or other static hosts:
- You'll need to temporarily replace the API key in `index.html` line 806
- **Remember:** Never commit API keys to public repositories
- Consider using Netlify Functions or similar for API key security

## 🔒 Security Notes

1. **Client-side API keys are visible to users** - consider server-side proxy for production
2. **Never commit API keys** to version control
3. **Use environment variables** in production environments
4. **Rotate keys regularly** and monitor usage

## 📝 Quick Start

1. Replace API key in line 806 of `index.html`
2. Test locally by opening `index.html` in browser
3. Deploy to Vercel with environment variable
4. Remove API key from code before committing to git