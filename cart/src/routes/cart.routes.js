const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validation = require("../middlewares/validation.middleware");

router.post(
  "/items",
  validation.validateAddIeItemToCart,
  authMiddleware(["user"]),
  cartController.addItemToCart
);

module.exports = router;
