const axios = require('axios');
const readline = require('readline');

// API SMSHub
const API_KEY = '';
const COUNTRY_CODE = 0; // Indonesia
const SERVICE = 'go';
const CURRENCY = 840;
const MAX_PRICE = 0.038;
const OPERATOR = '';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const orders = []; // Untuk menyimpan pesanan nomor

async function getBalance() {
    try {
        const response = await axios.get('https://smshub.org/stubs/handler_api.php', {
            params: { api_key: API_KEY,action: 'getBalance', currency: CURRENCY },
        });

        if (response.data.startsWith('ACCESS_BALANCE')) {
            const balance = response.data.split(':')[1];
            return parseFloat(balance);
        } else {
            console.error('Gagal mendapatkan saldo:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Kesalahan saat mengambil saldo:', error.message);
        return null;
    }
}

async function buyNumber() {
    try {
        const response = await axios.get('https://smshub.org/stubs/handler_api.php', {
            params: {
                api_key: API_KEY,
                action: 'getNumber',
                service: SERVICE,
                operator: OPERATOR,
                country: COUNTRY_CODE,
                maxPrice: MAX_PRICE,
                currency: CURRENCY,
            },
        });

        if (response.data.startsWith('ACCESS_NUMBER')) {
            const [_, id, number] = response.data.split(':');
            orders.push({ id, number, otp: null }); // Tambahkan nomor ke daftar pesanan
        } else {
            console.error('Gagal memesan nomor:', response.data);
        }
    } catch (error) {
        console.error('Kesalahan saat memesan nomor:', error.message);
    }
}

async function fetchOtp(order) {
    try {
        const response = await axios.get('https://smshub.org/stubs/handler_api.php', {
            params: { api_key: API_KEY, action: 'getStatus', id: order.id },
        });

        if (response.data.startsWith('STATUS_OK')) {
            order.otp = response.data.split(':')[1]; // Update OTP
        }
    } catch (error) {
        console.error(`Kesalahan saat mengambil OTP untuk ${order.number}:`, error.message);
    }
}

async function cancelOrder(orderId) {
    try {
        await axios.get('https://smshub.org/stubs/handler_api.php', {
            params: { api_key: API_KEY, action: 'setStatus', id: orderId, status: 8 },
        });
    } catch (error) {
        console.error(`Gagal membatalkan pesanan ${orderId}:`, error.message);
    }
}

function displayOrders() {
    console.clear();
    console.log('Nomor yang dibeli:');
    orders.forEach((order, index) => {
        console.log(`[${index + 1}] ${order.number} | OTP: ${order.otp || 'Menunggu...'}`);
    });
    console.log('\nOpsi:');
    console.log('1 -> Cancel semua nomor dan beli ulang');
    console.log('2 -> Cancel semua nomor dan keluar');
    console.log('c1-c5 -> Cancel nomor tertentu (contoh: c1 untuk cancel nomor 1)');
}

async function handleInput() {
    rl.on('line', async (input) => {
        input = input.trim();
        if (input === '1') {
            console.log('Membatalkan semua nomor dan memesan ulang...');
            for (const order of orders) await cancelOrder(order.id);
            orders.length = 0;
            await buyNumbers();
        } else if (input === '2') {
            console.log('Membatalkan semua nomor dan keluar...');
            for (const order of orders) await cancelOrder(order.id);
            rl.close();
            process.exit(0);
        } else if (input.startsWith('c') && orders.length > 0) {
            const index = parseInt(input.slice(1)) - 1;
            if (index >= 0 && index < orders.length) {
                console.log(`Membatalkan nomor ${orders[index].number}...`);
                await cancelOrder(orders[index].id);
                orders.splice(index, 1);
            } else {
                console.log('Nomor tidak valid!');
            }
        } else {
            console.log('Input tidak valid. Coba lagi.');
        }
    });
}

async function buyNumbers() {
    const balance = await getBalance();
    if (balance === null) {
        console.log('Tidak dapat mengambil saldo. Menghentikan program.');
        rl.close();
        return;
    }

    const maxNumbers = Math.floor(balance / MAX_PRICE); // Hitung jumlah maksimum nomor yang bisa dibeli
    const numbersToBuy = Math.min(2, maxNumbers); // Beli hingga 10 nomor atau sebanyak saldo memungkinkan

    if (numbersToBuy === 0) {
        console.log('Saldo tidak mencukupi untuk membeli nomor.');
        rl.close();
        return;
    }

    console.log(`Membeli ${numbersToBuy} nomor...`);
    for (let i = 0; i < numbersToBuy; i++) await buyNumber();
    displayOrders();

    setInterval(async () => {
        for (const order of orders) {
            if (!order.otp) await fetchOtp(order);
        }
        displayOrders();
    }, 1500); // Refresh setiap 3 detik
}

// Mulai proses
(async () => {
    await buyNumbers();
    await handleInput();
})();
