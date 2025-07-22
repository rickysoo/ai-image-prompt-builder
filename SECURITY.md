# Security Policy

## 🔒 Security Overview

This application handles sensitive API keys and user-generated content. Please follow these security guidelines.

## ⚠️ Important Security Notes

### API Key Security
- **Never commit API keys to version control**
- **Use environment variables or server-side proxy in production**
- **The current implementation is for demonstration only**
- **Client-side API keys can be exposed to users**

### Recommended Production Setup

1. **Server-Side Proxy**: 
   ```
   Client -> Your Server -> OpenAI API
   ```

2. **Environment Variables**:
   ```bash
   OPENAI_API_KEY=your-actual-key
   NODE_ENV=production
   ```

3. **Rate Limiting**: Implement API rate limits
4. **CORS**: Configure proper cross-origin policies
5. **Input Validation**: Sanitize all user inputs

## 🚨 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🔍 Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: [your-security-email@domain.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

### Response Timeline
- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution**: Varies by severity

## 🛡️ Security Measures

### Current Implementation
- Input sanitization for prompts
- Client-side validation
- CSP headers recommended
- HTTPS enforcement recommended

### Additional Recommendations
- Implement Content Security Policy (CSP)
- Use HTTPS in production
- Regular dependency updates
- Security headers (HSTS, X-Frame-Options, etc.)
- Input length limits
- Rate limiting per user/IP

## 📋 Security Checklist

Before deploying to production:

- [ ] Move API keys to server-side
- [ ] Implement rate limiting
- [ ] Set up proper CORS
- [ ] Add input validation
- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Test with security scanning tools
- [ ] Set up monitoring and alerts

## 🔄 Updates

This security policy will be updated as the project evolves. Check back regularly for updates.

---

**Last Updated**: January 2025