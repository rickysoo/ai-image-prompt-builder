# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Progressive Web Application (PWA)** that helps users build AI image prompts through an interactive drag-and-drop interface. The app is a single-page application built as a standalone HTML file with embedded CSS and JavaScript that integrates with OpenAI's GPT-4o-mini API to enhance user-created prompts.

## Architecture

### Single-File Application Structure
- **Main Application**: `index.html` - Complete standalone PWA containing all HTML, CSS, and JavaScript
- **Backup Reference**: `backup.html` - Original static prompt guide (9 style categories)
- **PWA Components**: `manifest.json`, `sw.js`, icon files for native app experience

### Core Components & Data Flow
1. **Component Categories**: Subject, Style, Lighting, Technical - defined as data arrays in JavaScript
2. **Drag-and-Drop System**: HTML5 DataTransfer API with dual interaction (drag/drop + click)
3. **Prompt Enhancement Pipeline**: User selections → OpenAI GPT-4o-mini API → Enhanced prompt display
4. **State Management**: `promptComponents` array holds selected components, drives UI updates
5. **Audio Feedback**: Web Audio API generates category-specific synthesized sounds
6. **Analytics Integration**: Google Analytics 4 (G-1MBD8RK69P) with comprehensive event tracking

### Layout System
- **CSS Grid**: 3-column layout with named grid areas
- **Non-linear Component Arrangement**: Rotated sections using CSS transforms for game-like feel
- **Responsive Design**: Media queries handle mobile/tablet/desktop breakpoints
- **Glassmorphism Effects**: backdrop-filter blur effects throughout UI

### API Integration
- **OpenAI Integration**: GPT-4o-mini model for prompt enhancement
- **Security Model**: Client-side API key (development) with environment variable fallback
- **Error Handling**: Graceful degradation to basic prompts on API failure

## Development Commands

This is a static web application with no build process. Development workflow:

### Local Development
```bash
# Serve locally (any static server)
npx serve .
# or
python -m http.server 8000
# or 
php -S localhost:8000
```

### Testing
- **Manual Testing**: Open `index.html` in browser (file:// protocol has limitations)
- **PWA Testing**: Requires HTTPS or localhost for full PWA features
- **Cross-browser Testing**: Test drag-and-drop, clipboard API, Web Audio API

### Deployment
- **Static Hosting**: Deploy directly to any static host (Netlify, Vercel, GitHub Pages)
- **HTTPS Required**: For clipboard API and PWA installation
- **API Key Security**: Move to server-side proxy for production (see SECURITY.md)

## Key Implementation Details

### Component Data Structure
Components are defined as JavaScript objects with `category`, `value`, `text` properties. Categories determine visual styling and audio feedback.

### Prompt Generation Flow
1. User adds components via drag/drop or click
2. `addComponent()` validates and stores in `promptComponents` array
3. `updatePromptDisplay()` calls `generateEnhancedPrompt()` 
4. API request sent to OpenAI with component data and enhancement instructions
5. Response displayed in prompt area, copy functionality enabled

### Audio System
Synthesized audio using Web Audio API with category-specific frequencies and waveforms:
- Subject: 523.25Hz sine wave
- Style: 659.25Hz triangle wave  
- Lighting: 783.99Hz sawtooth wave
- Technical: 440Hz square wave

### PWA Implementation
- Service worker caches static assets and external fonts
- Manifest defines app metadata, icons, shortcuts
- Offline-first strategy with cache-first approach
- Background sync and push notification infrastructure (not currently used)

### Security Considerations
- API keys are client-side visible (development setup)
- Input validation on prompt components
- CSP headers recommended for production
- Rate limiting should be implemented server-side

## Environment Variables

Configure via `.env` file (see `.env.example`):
- `OPENAI_API_KEY`: OpenAI API key for prompt enhancement
- `NODE_ENV`: Environment setting
- `SESSION_SECRET`: For session security (future use)

## Analytics Events Tracked

Comprehensive user interaction tracking:
- Component interactions (clicks, drags, adds)
- Prompt generation attempts/successes/failures
- Copy prompt actions with method tracking
- Navigation to external tools
- PWA service worker events
- App initialization with device context

## Files to Avoid Modifying

- `backup.html`: Preserved original implementation
- `images/*`: Static reference images for style examples
- `icon-*.svg`: PWA icons