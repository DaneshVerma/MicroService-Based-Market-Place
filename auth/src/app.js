const express = require("express");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
// simple request logger for tests
app.use((req, res, next) => {
  console.log("REQ", req.method, req.originalUrl);
  const _end = res.end;
  res.end = function (...args) {
    console.log("RES", req.method, req.originalUrl, res.statusCode);
    _end.apply(this, args);
  };
  next();
});
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("hii");
  res.status(200).json({ message: "Auth service up" });
});

module.exports = app;
