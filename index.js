/**
 * SMSHub Number Buyer
 * Aplikasi CLI untuk membeli dan mengelola nomor telepon virtual dari SMSHub API
 */

const Logger = require('./src/utils/logger');
const Config = require('./src/utils/config');
const SMSNumberManager = require('./src/core/SMSNumberManager');

// Tampilkan judul aplikasi
Logger.showAppTitle();

// Mulai aplikasi
(async () => {
  try {
    // Muat konfigurasi
    const config = Config.load('./config/config.yml');
    
    // Validasi konfigurasi
    if (!Config.validate(config)) {
      process.exit(1);
    }
    
    // Buat dan inisialisasi aplikasi
    const app = new SMSNumberManager(config);
    await app.initialize();
  } catch (error) {
    Logger.error('Application error', error);
    process.exit(1);
  }
})();
