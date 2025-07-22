// Global variables
// Note: API key removed for security. Set up environment variables or server-side proxy in production.
let openaiApiKey = process.env.OPENAI_API_KEY || 'your-api-key-here';

// Sample images for each style (placeholder URLs - in a real app, these would be actual generated images)
const sampleImages = {
    realistic: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojYjNkM2YyO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4Y2FmZjA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SZWFsaXN0aWM8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2FtcGxlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
    photographic: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmNiNjlmO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmVjZDI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaG90b2dyYXBoaWM8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2FtcGxlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
    painterly: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmVkNmUzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNhOGVkZWE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QYWludGVybHk8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2FtcGxlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
    sketch: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjdmMGYwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNjNWM1YzU7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ta2V0Y2g8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2FtcGxlIEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
    cartoon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojODlmN2ZlO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA <c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NmE2ZmY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DYXJ0b29uPC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBJbWFnZTwvdGV4dD4KPC9zdmc+',
    surreal: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjA5M2ZiO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNTU3NmM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdXJyZWFsPC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBJbWFnZTwvdGV4dD4KPC9zdmc+',
    pixar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmE3MDlhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWUxNDA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QaXhhcjwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYW1wbGUgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==',
    concept: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGMwYzBjO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4ZTJkZTI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db25jZXB0PC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBJbWFnZTwvdGV4dD4KPC9zdmc+',
    minimalist: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTNmZmU3O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkOWU3ZmY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NaW5pbWFsaXN0PC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBJbWFnZTwvdGV4dD4KPC9zdmc+'
};

// Content data for each section
const contentData = {
    realistic: {
        title: 'Realistic Style',
        subtitle: 'Lifelike rendering with natural lighting and details'
    },
    photographic: {
        title: 'Photographic Style', 
        subtitle: 'Camera-style sharpness, focus, and composition'
    },
    painterly: {
        title: 'Painterly Style',
        subtitle: 'Brushstrokes, textures, and fine art appearance'
    },
    sketch: {
        title: 'Sketch / Line Art',
        subtitle: 'Minimal outlines with hand-drawn feel'
    },
    cartoon: {
        title: 'Cartoon / Comic',
        subtitle: 'Exaggerated, playful characters with bold styling'
    },
    surreal: {
        title: 'Surreal / Dreamlike',
        subtitle: 'Fantasy scenes and abstract compositions'
    },
    pixar: {
        title: 'Pixar-style / 3D',
        subtitle: 'Soft-shaded, character-driven scenes'
    },
    concept: {
        title: 'Concept Art',
        subtitle: 'Rough visualizations for ideas, games, or films'
    },
    minimalist: {
        title: 'Minimalist / Flat',
        subtitle: 'Clean, modern, iconographic visuals'
    },
    'general-tips': {
        title: 'General Tips',
        subtitle: 'Essential guidelines for effective AI image prompting'
    },
    'pro-tips': {
        title: 'Pro Tips',
        subtitle: 'Advanced techniques for professional results'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Load sample images
    loadSampleImages();
    
    // Setup navigation
    setupNavigation();
    
    // Setup textarea auto-resize
    setupTextareas();
    
    // Initialize first section as active
    showContent('realistic');
    
});

// Setup navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(nl => nl.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get content type and show corresponding section
            const contentType = this.getAttribute('data-content');
            showContent(contentType);
        });
    });
}

// Show content section
function showContent(contentType) {
    // Hide all content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(contentType + '-content');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update header
    updateContentHeader(contentType);
}

// Update content header
function updateContentHeader(contentType) {
    const titleElement = document.getElementById('content-title');
    const subtitleElement = document.querySelector('.content-subtitle');
    
    const data = contentData[contentType];
    if (data) {
        titleElement.textContent = data.title;
        subtitleElement.textContent = data.subtitle;
    }
}

// Setup textarea auto-resize
function setupTextareas() {
    const promptInputs = document.querySelectorAll('.prompt-input');
    
    promptInputs.forEach(promptInput => {
        // Auto-resize textarea
        promptInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        
        // Initial resize
        setTimeout(() => {
            promptInput.style.height = 'auto';
            promptInput.style.height = promptInput.scrollHeight + 'px';
        }, 100);
    });
}

// Load sample images
function loadSampleImages() {
    Object.keys(sampleImages).forEach(style => {
        const img = document.getElementById(style + '-image');
        if (img) {
            img.src = sampleImages[style];
            img.style.display = 'block';
        }
    });
}

// No longer needed - API key is hardcoded

// Generate image using DALL-E 3
async function generateImage(style) {
    const promptInput = document.querySelector(`[data-style="${style}"]`);
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showNotification('Please enter a prompt', 'error');
        return;
    }
    
    const img = document.getElementById(style + '-image');
    const loadingSpinner = img.parentElement.querySelector('.loading-spinner');
    const generateBtn = document.querySelector(`[onclick="generateImage('${style}')"]`);
    
    try {
        // Show loading state
        loadingSpinner.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        // Simulate API call delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes - in a real app, you'd need a backend server to make the OpenAI API call
        // due to CORS restrictions. Here we'll show the concept with a placeholder.
        
        // Create a placeholder image with the style name
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const colors = {
            realistic: ['#b3d3f2', '#8caff0'],
            photographic: ['#fcb69f', '#ffecd2'], 
            painterly: ['#fed6e3', '#a8edea'],
            sketch: ['#f7f0f0', '#c5c5c5'],
            cartoon: ['#89f7fe', '#66a6ff'],
            surreal: ['#f093fb', '#f5576c'],
            pixar: ['#fa709a', '#fee140'],
            concept: ['#0c0c0c', '#8e2de2'],
            minimalist: ['#e3ffe7', '#d9e7ff']
        };
        
        const styleColors = colors[style] || ['#667eea', '#764ba2'];
        gradient.addColorStop(0, styleColors[0]);
        gradient.addColorStop(1, styleColors[1]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = style === 'concept' ? '#ffffff' : '#374151';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Generated Image', canvas.width/2, canvas.height/2 - 20);
        ctx.font = '18px Arial';
        ctx.fillText(`Style: ${style.charAt(0).toUpperCase() + style.slice(1)}`, canvas.width/2, canvas.height/2 + 20);
        ctx.font = '14px Arial';
        ctx.fillText('(Demo placeholder)', canvas.width/2, canvas.height/2 + 50);
        
        // Convert to data URL and set as image source
        const imageUrl = canvas.toDataURL();
        img.src = imageUrl;
        img.style.display = 'block';
        
        showNotification(`Demo image generated for ${style} style! In a real app, this would be a DALL-E 3 image.`);
        
    } catch (error) {
        console.error('Error generating image:', error);
        showNotification('Error generating demo image', 'error');
    } finally {
        // Hide loading state
        loadingSpinner.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Image';
    }
}

function copyPrompt(button) {
    const promptInput = button.parentElement.querySelector('.prompt-input');
    const prompt = promptInput.value;
    
    copyToClipboard(prompt).then(() => {
        // Visual feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
        
        // Show notification
        showNotification('Prompt copied successfully!');
        
        // Add subtle animation to the prompt input
        promptInput.style.transform = 'scale(1.02)';
        setTimeout(() => {
            promptInput.style.transform = 'scale(1)';
        }, 200);
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            textArea.remove();
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            textArea.remove();
            return false;
        }
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : 'success'}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 4 seconds (longer for errors)
    const hideDelay = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, hideDelay);
}

// Removed particle effects for cleaner sidebar layout

// Removed shortcuts functionality for cleaner sidebar design

// Removed interactive effects for sidebar layout

// Enhanced copy functionality with analytics (optional)
function trackCopy(style) {
    // You could add analytics tracking here
    console.log(`Prompt copied for style: ${style}`);
}

// Add right-click context menu for prompt inputs
document.addEventListener('contextmenu', function(e) {
    const promptInput = e.target.closest('.prompt-input');
    if (promptInput) {
        e.preventDefault();
        const prompt = promptInput.value;
        copyToClipboard(prompt);
        showNotification('Prompt copied via right-click!');
    }
});

// Progressive Web App features (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // You could register a service worker here for offline functionality
        console.log('App ready for PWA features');
    });
}