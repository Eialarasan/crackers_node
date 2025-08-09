const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.latestQr = null;
        this.initialize();
    }

    initialize() {
        // Create WhatsApp client
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox']
            }
        });

        // Generate QR code for authentication
        this.client.on('qr', (qr) => {
            this.latestQr = qr;
            console.log('Please scan the following QR code with WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        // Handle ready state
        this.client.on('ready', () => {
            console.log('WhatsApp client is ready!');
            this.isReady = true;
        });

        // Initialize client
        this.client.initialize();
    }

    getLatestQr() {
        return this.latestQr;
    }

    async sendOrderNotification(storeOwnerNumber, orderDetails) {
        try {
            if (!this.isReady) {
                throw new Error('WhatsApp client is not ready');
            }

            const message = this.formatOrderMessage(orderDetails);
            
            // Format the phone number (remove any spaces, dashes, etc.)
            const formattedNumber = storeOwnerNumber.replace(/[^0-9]/g, '');
            const chatId = `${formattedNumber}@c.us`;

            await this.client.sendMessage(chatId, message);
            return true;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }

    formatOrderMessage(order) {
        let message = '🛍️ *New Order Received!*\n\n';
        message += `Order ID: #${order.id}\n`;
        message += `Customer Name: ${order.customerName}\n`;
        message += `Phone: ${order.phoneNumber}\n\n`;
        message += '*Order Details:*\n';

        // Format product details
        const products = order.productDetails;
        products.forEach(product => {
            message += `▪️ ${product.name} x ${product.quantity} - ₹${product.price * product.quantity}\n`;
        });

        message += `\n💰 Total Amount: ₹${order.totalAmount}\n`;
        message += `📍 Delivery Address: ${order.deliveryAddress}\n\n`;
        message += 'Please process this order as soon as possible. Thank you!';

        return message;
    }
}

// Create a singleton instance
const whatsAppService = new WhatsAppService();
module.exports = whatsAppService;
