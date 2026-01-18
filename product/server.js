require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require('./src/broker/broker');
const config = require('./src/config/config');

connectDB();

connect();

app.listen(config.PORT, () => {
    console.log(`Product service listening on port ${config.PORT}`);
});
