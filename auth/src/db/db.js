const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/environments");
function connectDB() {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((err) => {
      console.log(err.message, "database connection error");
    });
}
module.exports = connectDB;
