const express = require("express");
const router = express.Router();
const multer = require("multer");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const {
  validateProduct,
  validateImages,
} = require("../middlewares/validators/product.validator");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySeller,
} = require("../controller/product.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.array("images", 5),
  createAuthMiddleware(["admin", "seller"]),
  validateProduct,
  validateImages,
  createProduct
);

router.get("/", getProducts);

router.patch("/:id", createAuthMiddleware(["admin", "seller"]), updateProduct);

router.delete("/:id", createAuthMiddleware(["admin", "seller"]), deleteProduct);

router.get("/seller", createAuthMiddleware(["seller"]), getProductsBySeller);

router.get("/:id", getProductById);

module.exports = router;
