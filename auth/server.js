require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require('./src/broker/broker');
const config = require('./src/config/environments');


connectDB();
connect();

app.listen(config.PORT, () => {
    console.log(`Auth service is running on port ${config.PORT}`);
})