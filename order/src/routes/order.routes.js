const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

router.post("/orders", authMiddleware(["user"]), orderController.createOrder);

module.exports = router;
