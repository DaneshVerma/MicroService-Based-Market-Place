const mongoose = require("mongoose");

async function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => console.log("db connection err", err.message));
}
module.exports = connectDB;
