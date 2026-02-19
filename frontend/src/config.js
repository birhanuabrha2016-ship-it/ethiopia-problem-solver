// config.js - THIS SMARTLY CHOOSES THE RIGHT SETTINGS
import configDev from './config.dev';
import configProd from './config.prod';

let config;

if (process.env.NODE_ENV === 'production') {
  // If we are on the live server, use the production settings
  config = configProd;
} else {
  // If we are on our computer, use the development settings
  config = configDev;
}

export default config;
