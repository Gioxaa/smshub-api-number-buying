const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const boxen = require('boxen');

/**
 * Utilitas untuk logging dan tampilan konsol
 */
class Logger {
  /**
   * Menampilkan judul aplikasi dengan ASCII art
   */
  static showAppTitle() {
    console.log(
      chalk.cyan(
        figlet.textSync('SMSHub Buyer', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default'
        })
      )
    );
  }

  /**
   * Membuat spinner untuk operasi asinkron
   * @param {string} text - Teks yang akan ditampilkan selama loading
   * @returns {object} - Objek spinner
   */
  static createSpinner(text) {
    return ora(chalk.yellow(text)).start();
  }

  /**
   * Log pesan dengan warna berdasarkan tipenya
   * @param {string} message - Pesan yang akan ditampilkan
   * @param {string} type - Tipe pesan (info, success, warning, error)
   */
  static log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    
    console.log(colors[type](message));
  }

  /**
   * Menampilkan error dengan format yang menarik
   * @param {string} message - Pesan error
   * @param {Error|string} error - Objek error atau string
   */
  static error(message, error) {
    console.error(chalk.bgRed.white(' ERROR '), chalk.red(message));
    if (error) {
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      } else {
        console.error(chalk.red(error));
      }
    }
  }

  /**
   * Menampilkan notifikasi OTP
   * @param {string} otp - Kode OTP
   * @param {string} number - Nomor telepon
   */
  static notifyOtp(otp, number) {
    console.log(chalk.bgGreen.black(` 🎉 OTP RECEIVED: ${otp} for number ${number} `));
  }

  /**
   * Membuat box untuk menampilkan informasi
   * @param {string} content - Konten yang akan ditampilkan dalam box
   * @param {string} color - Warna border box
   * @param {object} options - Opsi tambahan untuk box
   * @returns {string} - String berformat box
   */
  static box(content, color = 'blue', options = {}) {
    return boxen(content, {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: color,
      ...options
    });
  }

  /**
   * Menampilkan pesan selamat tinggal saat keluar
   */
  static goodbye() {
    console.log(chalk.green('\n👋 Thank you for using SMSHub Number Buyer. Goodbye!\n'));
  }
}

module.exports = Logger; 