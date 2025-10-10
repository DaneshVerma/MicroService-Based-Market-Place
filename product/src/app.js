const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cookieParser)

module.exports = app;
