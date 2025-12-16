const orderModel = require("../models/order.model");
const mongoose = require("mongoose");

async function createOrder(req, res) {
  try {
    const { shippingAddress } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({
        message: "Invalid shipping address. All fields are required.",
      });
    }

    // Get user ID from auth token (assuming middleware sets req.user)
    const userId = req.user?.id || req.user?._id;

    // Mock cart items (in production, fetch from cart service)
    const cartItems = [
      {
        product: new mongoose.Types.ObjectId(),
        quantity: 2,
        price: {
          amount: 29.99,
          currency: "USD",
        },
      },
      {
        product: new mongoose.Types.ObjectId(),
        quantity: 1,
        price: {
          amount: 49.99,
          currency: "USD",
        },
      },
    ];

    // Calculate total price
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price.amount * item.quantity,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 10; // Flat shipping
    const totalAmount = subtotal + tax + shipping;

    // Create order
    const order = await orderModel.create({
      user: userId,
      items: cartItems,
      status: "PENDING",
      totalPrice: {
        amount: totalAmount,
        currency: "USD",
      },
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.pincode,
        country: shippingAddress.country,
      },
    });

    // Mock inventory reservation (in production, call inventory service)
    const inventoryReservation = { success: true };

    res.status(201).json({
      order,
      inventoryReservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
}

module.exports = {
  createOrder,
};
