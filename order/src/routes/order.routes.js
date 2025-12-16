const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { validateCreateOrder } = require("../middlewares/validation.middleware");
const orderController = require("../controllers/order.controller");

router.get("/orders/me", authMiddleware(["user"]), orderController.getMyOrders);

router.get(
  "/orders/:id",
  authMiddleware(["user"]),
  orderController.getOrderById
);

router.post(
  "/orders",
  validateCreateOrder,
  authMiddleware(["user"]),
  orderController.createOrder
);

router.post(
  "/orders/:id/cancel",
  authMiddleware(["user"]),
  orderController.cancelOrder
);

module.exports = router;
