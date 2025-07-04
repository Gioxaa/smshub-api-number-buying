const axios = require('axios');
const Logger = require('../utils/logger');

/**
 * Kelas untuk berinteraksi dengan API SMSHub
 */
class SMSHubClient {
  /**
   * Membuat instance SMSHubClient
   * @param {object} config - Objek konfigurasi
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Membuat permintaan ke API SMSHub
   * @param {string} action - Aksi API
   * @param {object} params - Parameter tambahan
   * @returns {string|null} - Respons API atau null jika gagal
   */
  async makeRequest(action, params = {}) {
    try {
      const response = await axios.get(this.config.api_url, {
        params: {
          api_key: this.config.api_key,
          action,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      Logger.error(`API Error (${action})`, error);
      return null;
    }
  }

  /**
   * Mendapatkan saldo akun
   * @returns {number|null} - Saldo atau null jika gagal
   */
  async getBalance() {
    const spinner = Logger.createSpinner('Checking account balance...');
    const response = await this.makeRequest('getBalance', { currency: this.config.currency });
    
    if (response && response.startsWith('ACCESS_BALANCE')) {
      const balance = parseFloat(response.split(':')[1]);
      spinner.succeed(`Balance: $${balance.toFixed(2)}`);
      return balance;
    }
    
    spinner.fail('Failed to get balance');
    Logger.error('API response:', response);
    return null;
  }

  /**
   * Membeli nomor baru
   * @returns {object|null} - Objek nomor atau null jika gagal
   */
  async buyNumber() {
    const spinner = Logger.createSpinner('Purchasing phone number...');
    const response = await this.makeRequest('getNumber', {
      service: this.config.service,
      operator: this.config.operator,
      country: this.config.country_code,
      maxPrice: this.config.max_price,
      currency: this.config.currency,
    });

    if (response && response.startsWith('ACCESS_NUMBER')) {
      const [_, id, number] = response.split(':');
      spinner.succeed(`Successfully purchased number: ${number}`);
      return { id, number, otp: null };
    }
    
    spinner.fail('Failed to purchase number');
    Logger.error('API response:', response);
    return null;
  }

  /**
   * Mendapatkan kode OTP untuk nomor
   * @param {string} orderId - ID pesanan
   * @returns {string|null} - Kode OTP atau null jika belum tersedia
   */
  async getOtp(orderId) {
    const response = await this.makeRequest('getStatus', { id: orderId });
    
    if (response && response.startsWith('STATUS_OK')) {
      return response.split(':')[1];
    }
    
    return null;
  }

  /**
   * Membatalkan pesanan nomor
   * @param {string} orderId - ID pesanan
   * @returns {string|null} - Respons API atau null jika gagal
   */
  async cancelOrder(orderId) {
    const spinner = Logger.createSpinner('Cancelling order...');
    const response = await this.makeRequest('setStatus', { id: orderId, status: 8 });
    
    if (response && response.startsWith('ACCESS_CANCEL')) {
      spinner.succeed('Order cancelled successfully');
    } else {
      spinner.fail('Failed to cancel order');
    }
    
    return response;
  }
}

module.exports = SMSHubClient; 