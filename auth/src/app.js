const express = require("express")
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("hii");
  res.status(200).json({ message: "Auth service up" });
});

module.exports = app;
