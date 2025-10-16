const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const productRoutes = require("./routes/product.route");

app.use(express.json());
app.use(cookieParser());
app.use("/api/products", productRoutes);
module.exports = app;
