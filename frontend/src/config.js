// config.js - THIS SMARTLY CHOOSES THE RIGHT SETTINGS
let config;

if (process.env.NODE_ENV === 'production') {
  // If we are on the live server, use the production settings
  config = require('./config.prod').default;
} else {
  // If we are on our computer, use the development settings
  config = require('./config.dev').default;
}

export default config;