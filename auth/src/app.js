const express = require("express")
const app = express()

app.use(express.json());

app.get("/", (req, res) => {
  console.log("hii");
  res.status(200);
});

module.exports = app;
