const express = require("express");
const router = express.Router();
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const {
  validateProduct,
  validateImages,
} = require("../middlewares/validators/product.validator");
const { createProduct } = require("../controller/product.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.array("images", 5),
  createAuthMiddleware(["admin", "seller"]),
  validateProduct,
  validateImages,
  createProduct
);

module.exports = router;
