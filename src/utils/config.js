const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Logger = require('./logger');

/**
 * Kelas untuk mengelola konfigurasi aplikasi
 */
class Config {
  /**
   * Memuat konfigurasi dari file YAML
   * @param {string} configPath - Path ke file konfigurasi
   * @returns {object} - Objek konfigurasi
   */
  static load(configPath = './config/config.yml') {
    const spinner = Logger.createSpinner('Loading configuration...');
    try {
      const configContent = fs.readFileSync(path.resolve(configPath), 'utf8');
      const config = yaml.load(configContent);
      
      spinner.succeed('Configuration loaded successfully');
      return config;
    } catch (e) {
      spinner.fail('Error loading configuration');
      Logger.error('Error details:', e);
      process.exit(1);
    }
  }

  /**
   * Memvalidasi konfigurasi yang diperlukan
   * @param {object} config - Objek konfigurasi
   * @returns {boolean} - True jika valid
   */
  static validate(config) {
    const requiredFields = [
      'api_key', 'country_code', 'service', 
      'currency', 'max_price', 'api_url'
    ];
    
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      Logger.error(`Missing required configuration fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  }
}

module.exports = Config; 