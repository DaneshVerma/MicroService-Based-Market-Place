require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const config = require("./src/config/config");


connectDB();


app.listen(config.PORT, () => {
    console.log(`Cart service is running on port ${config.PORT}`);
})