require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/config');

const connectDB = require('./src/db/db');
const listener = require('./src/broker/listener');
const { connect } = require('./src/broker/broker');


connectDB();

connect().then(() => {
    listener();
})


app.listen(config.PORT, () => {
    console.log(`Seller dashboard service is running on port ${config.PORT}`);
})