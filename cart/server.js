const app = require("./src/app");
const conntectDB = require("./src/db/db");

conntectDB();

app.listen(3002, () => {
  console.log("server running on port 3002");
});
