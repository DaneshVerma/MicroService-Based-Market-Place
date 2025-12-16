const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { validateCreateOrder } = require("../middlewares/validation.middleware");
const orderController = require("../controllers/order.controller");

router.post(
  "/orders",
  validateCreateOrder,
  authMiddleware(["user"]),
  orderController.createOrder
);

module.exports = router;
