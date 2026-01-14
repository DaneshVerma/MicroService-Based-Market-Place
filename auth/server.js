const app = require("./src/app");
const connectDB = require("./src/db/db");
const { connect } = require("./src/broker/broker");

function startServer() {
  connectDB();
  connect();
  app.listen(3000, () => {
    console.log("server running on port 3000");
  });
}

startServer();
