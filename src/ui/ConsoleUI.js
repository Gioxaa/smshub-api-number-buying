const chalk = require('chalk');
const Logger = require('../utils/logger');

/**
 * Kelas untuk mengelola tampilan konsol
 */
class ConsoleUI {
  /**
   * Membuat instance ConsoleUI
   * @param {Array} orders - Array pesanan
   */
  constructor(orders) {
    this.orders = orders;
  }

  /**
   * Membersihkan layar konsol
   */
  clear() {
    console.clear();
  }

  /**
   * Menampilkan pesanan dan opsi
   */
  displayOrders() {
    this.clear();
    
    // Menampilkan header aplikasi
    console.log(
      chalk.cyan(
        Logger.box(chalk.bold('SMSHub Number Buyer'), 'cyan', {
          padding: 1,
          margin: 1,
          borderStyle: 'round'
        })
      )
    );
    
    // Menampilkan pesanan
    console.log(chalk.bold.underline('\n📱 Purchased Numbers:'));
    if (this.orders.length === 0) {
      console.log(chalk.italic('No active numbers.'));
    } else {
      this.orders.forEach((order, index) => {
        const boxColor = order.otp ? 'green' : 'yellow';
        const otpStatus = order.otp 
          ? chalk.green(`OTP: ${order.otp}`) 
          : chalk.yellow('Waiting for OTP...');
          
        console.log(
          Logger.box(
            `${chalk.bold(`Number ${index + 1}:`)} ${chalk.blue(order.number)}\n${otpStatus}`,
            boxColor
          )
        );
      });
    }
    
    this.displayOptions();
  }
  
  /**
   * Menampilkan opsi menu
   */
  displayOptions() {
    // Menampilkan opsi
    console.log(chalk.bold.underline('\n🔧 Options:'));
    console.log(chalk.green('1') + ' -> Cancel all numbers and buy new ones');
    console.log(chalk.red('2') + ' -> Cancel all numbers and exit');
    console.log(chalk.yellow('c[n]') + ' -> Cancel specific number (e.g., c1 to cancel number 1)');
    
    // Menampilkan prompt
    console.log(chalk.cyan('\n> Enter your choice:'));
  }

  /**
   * Menampilkan pesan dengan warna berdasarkan tipe
   * @param {string} message - Pesan yang akan ditampilkan
   * @param {string} type - Tipe pesan (info, success, warning, error)
   */
  displayMessage(message, type = 'info') {
    Logger.log(message, type);
  }
}

module.exports = ConsoleUI; 