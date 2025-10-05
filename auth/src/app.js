const express = require("express")
const authRoutes = require("./routes/auth.routes")
const app = express()

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("hii");
  res.status(200).json({ message: "Auth service up" });
});

module.exports = app;
