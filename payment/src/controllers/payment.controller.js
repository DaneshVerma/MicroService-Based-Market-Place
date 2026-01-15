const paymentModel = require("../models/payment.model");
const axios = require("axios");
const { publishToQueue } = require("../broker/broker");

require("dotenv").config();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPayment(req, res) {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  try {
    const orderId = req.params.orderId;

    const orderResponse = await axios.get(
      "http://nova-alb-551701734.ap-northeast-3.elb.amazonaws.com/api/orders/" +
      orderId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const price = orderResponse.data.order.totalPrice;

    const order = await razorpay.orders.create(price);

    const payment = await paymentModel.create({
      order: orderId,
      razorpayOrderId: order.id,
      user: req.user.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
    });

    await publishToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED", payment);

    return res.status(201).json({ message: "Payment initiated", payment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyPayment(req, res) {
  const { razorpayOrderId, paymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("../../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const isValid = validatePaymentVerification(
      {
        order_id: razorpayOrderId,
        payment_id: paymentId,
      },
      signature,
      secret
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await paymentModel.findOne({
      razorpayOrderId,
      status: "PENDING",
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = "COMPLETED";

    await payment.save();

    await publishToQueue("PAYMENT_NOTIFICATION_COMPLETED", {
      paymentId: payment._id,
      orderId: payment.order,
      userId: payment.user,
      amount: payment.price.amount,
      currency: payment.price.currency,
      email: req.user.email,
      username: req.user.username,
    });

    await publishToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE", payment);

    res.status(200).json({ message: "Payment verified successfully", payment });
  } catch (err) {
    console.log(err);

    await publishToQueue("PAYMENT_NOTIFICATION_FAILED", {
      email: req.user.email,
      orderId: razorpayOrderId,
      paymentId: paymentId
    });

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createPayment,
  verifyPayment,
};
