const { config } = require('dotenv');
config();

module.exports = {
    PORT: process.env.PORT || 3007,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    RABBITMQ_URL: process.env.RABBITMQ_URL,

    // Service URLs
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
    PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
    CART_SERVICE_URL: process.env.CART_SERVICE_URL || 'http://localhost:3002',
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
    PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
    AI_BUDDY_SERVICE_URL: process.env.AI_BUDDY_SERVICE_URL || 'http://localhost:3005',
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
    SELLER_DASHBOARD_SERVICE_URL: process.env.SELLER_DASHBOARD_SERVICE_URL || 'http://localhost:3007',
};
