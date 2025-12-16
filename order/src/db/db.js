const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB");
  } catch (err) {
    console.log("error connecting  to mongoDB", err.message);
  }
}

module.exports = connectDB;
