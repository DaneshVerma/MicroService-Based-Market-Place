const mongoose = require('mongoose');

function connectDB() {
    try {
        mongoose.connect(process.env.SELLER_DASHBOARD_DB_URI);

        console.log('Connected to Seller Dashboard Database');
    }
    catch (error) {
        console.error('Error connecting to Seller Dashboard Database:', error);
    }
}
module.exports = connectDB;