const mongoose = require("mongoose");
const config = require("../config/config");

async function connectDB() {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => console.log("db connection err", err.message));
}
module.exports = connectDB;
