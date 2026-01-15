require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");

connectToDB();
connect();

app.listen(3003, () => {
  console.log("order service running on port 3003");
});
