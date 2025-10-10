require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
app.listen(3001, () => {
  connectDB();
  console.log("Server is running on port 3001");
});
