const express = require("express");
const router = express.Router();
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middleware");

const upload = multer({ dest: "uploads/" });
const { createProduct } = require("../controllers/product.controller");

router.post(
  "/",
  upload.array("images", 5),
  createAuthMiddleware(["admin", "seller"]),
  createProduct
);

module.exports = router;
