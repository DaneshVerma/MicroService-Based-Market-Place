require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");

app.listen(3001, () => {
  connectDB();
  connect();
  console.log("Server is running on port 3001");
});
