// Frontend Configuration
const config = {
  // API Configuration
  API_BASE_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://your-backend-url.railway.app',

  // App Configuration
  APP_NAME: 'Store Frontend',
  VERSION: '1.0.0'
};

// Make config available globally
window.CONFIG = config;