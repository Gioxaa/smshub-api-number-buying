const readline = require('readline');
const Logger = require('../utils/logger');
const SMSHubClient = require('../api/SMSHubClient');
const ConsoleUI = require('../ui/ConsoleUI');

/**
 * Kelas utama untuk mengelola nomor dan interaksi pengguna
 */
class SMSNumberManager {
  /**
   * Membuat instance SMSNumberManager
   * @param {object} config - Objek konfigurasi
   */
  constructor(config) {
    this.config = config;
    this.client = new SMSHubClient(config);
    this.orders = [];
    this.ui = new ConsoleUI(this.orders);
    
    // Membuat interface readline untuk input pengguna
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Menginisialisasi aplikasi
   */
  async initialize() {
    Logger.log('\n🚀 Initializing application...\n', 'info');
    await this.buyInitialNumbers();
    this.setupOtpRefresh();
    this.handleUserInput();
  }

  /**
   * Membeli nomor awal
   */
  async buyInitialNumbers() {
    const balance = await this.client.getBalance();
    
    if (balance === null) {
      this.ui.displayMessage('Could not retrieve balance. Exiting program.', 'error');
      this.exit();
      return;
    }

    const maxNumbers = Math.floor(balance / this.config.max_price);
    const numbersToBuy = Math.min(2, maxNumbers);

    if (numbersToBuy === 0) {
      this.ui.displayMessage('Insufficient balance to buy numbers.', 'error');
      this.exit();
      return;
    }

    this.ui.displayMessage(`Buying ${numbersToBuy} numbers...`, 'info');
    
    for (let i = 0; i < numbersToBuy; i++) {
      const newNumber = await this.client.buyNumber();
      if (newNumber) {
        this.orders.push(newNumber);
      }
    }
    
    this.ui.displayOrders();
  }

  /**
   * Mengatur interval untuk memeriksa OTP
   */
  setupOtpRefresh() {
    this.refreshInterval = setInterval(async () => {
      let updated = false;
      
      for (const order of this.orders) {
        if (!order.otp) {
          const otp = await this.client.getOtp(order.id);
          if (otp) {
            order.otp = otp;
            updated = true;
            Logger.notifyOtp(otp, order.number);
          }
        }
      }
      
      if (updated || this.orders.length > 0) {
        this.ui.displayOrders();
      }
    }, this.config.refresh_interval);
  }

  /**
   * Menangani input pengguna
   */
  handleUserInput() {
    this.rl.on('line', async (input) => {
      input = input.trim().toLowerCase();
      
      if (input === '1') {
        await this.cancelAllAndBuyNew();
      } else if (input === '2') {
        await this.cancelAllAndExit();
      } else if (input.startsWith('c') && this.orders.length > 0) {
        await this.cancelSpecificNumber(input);
      } else {
        this.ui.displayMessage('Invalid input. Try again.', 'warning');
        this.ui.displayOrders();
      }
    });
  }

  /**
   * Membatalkan semua nomor dan membeli yang baru
   */
  async cancelAllAndBuyNew() {
    this.ui.displayMessage('Cancelling all numbers and ordering new ones...', 'info');
    await this.cancelAllOrders();
    await this.buyInitialNumbers();
  }

  /**
   * Membatalkan semua nomor dan keluar
   */
  async cancelAllAndExit() {
    this.ui.displayMessage('Cancelling all numbers and exiting...', 'info');
    await this.cancelAllOrders();
    this.exit();
  }

  /**
   * Membatalkan semua pesanan nomor
   */
  async cancelAllOrders() {
    for (const order of this.orders) {
      await this.client.cancelOrder(order.id);
    }
    this.orders.length = 0;
  }

  /**
   * Membatalkan nomor tertentu
   * @param {string} input - Input pengguna (contoh: c1)
   */
  async cancelSpecificNumber(input) {
    const index = parseInt(input.slice(1)) - 1;
    
    if (index >= 0 && index < this.orders.length) {
      const orderToCancel = this.orders[index];
      this.ui.displayMessage(`Cancelling number ${orderToCancel.number}...`, 'info');
      
      await this.client.cancelOrder(orderToCancel.id);
      this.orders.splice(index, 1);
      
      this.ui.displayOrders();
    } else {
      this.ui.displayMessage('Invalid number selection!', 'warning');
      this.ui.displayOrders();
    }
  }

  /**
   * Keluar dari aplikasi
   */
  exit() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    Logger.goodbye();
    this.rl.close();
    setTimeout(() => process.exit(0), 500); // Beri waktu untuk output konsol
  }
}

module.exports = SMSNumberManager; 