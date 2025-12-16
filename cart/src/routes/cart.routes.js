const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validation = require("../middlewares/validation.middleware");

router.get('/', authMiddleware(["user"]), cartController.getCart)

router.post(
  "/items",
  validation.validateAddIeItemToCart,
  authMiddleware(["user"]),
  cartController.addItemToCart
);

router.patch(
  "/items/:productId",
  validation.validateUpdateCartItem,
  authMiddleware(["user"]),
  cartController.updateCartItem
);

module.exports = router;
