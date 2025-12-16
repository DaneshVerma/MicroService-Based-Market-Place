const axios = require("axios");
const orderModel = require("../models/order.model");

async function createOrder(req, res) {
  try {
    const user = req.user;
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    const { shippingAddress } = req.body;

    // Fetch user cart from cart service
    const cartResponse = await axios.get("http://localhost:3002/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cart = cartResponse.data.cart;

    // Check if cart has items
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty. Cannot create order.",
      });
    }

    // Fetch product details with pricing from product service
    const productIds = cart.items.map((item) => item.productId);
    const productDetailsPromises = productIds.map((id) =>
      axios.get(`http://localhost:3001/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    const productResponses = await Promise.all(productDetailsPromises);
    const products = productResponses.map((res) => res.data);

    // Build order items with pricing
    const orderItems = cart.items.map((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      );

      if (!product) {
        throw new Error(`Product ${cartItem.productId} not found`);
      }

      return {
        product: cartItem.productId,
        quantity: cartItem.quantity,
        price: {
          amount: product.price.amount,
          currency: product.price.currency,
        },
      };
    });

    // Calculate total price (subtotal + tax + shipping)
    const subtotal = orderItems.reduce((sum, item) => {
      return sum + item.price.amount * item.quantity;
    }, 0);

    const taxRate = 0.1; // 10% tax
    const shippingCost = 50; // Flat shipping cost
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax + shippingCost;

    // Create order
    const order = new orderModel({
      user: user.id,
      items: orderItems,
      status: "PENDING",
      totalPrice: {
        amount: totalAmount,
        currency: orderItems[0].price.currency,
      },
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.pincode,
        country: shippingAddress.country,
      },
    });

    await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);

    // Handle specific errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        message: "Error creating order",
        error: error.response.data?.message || error.message,
      });
    }

    return res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const orders = await orderModel
      .find({ user: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalOrders = await orderModel.countDocuments({ user: user.id });

    return res.status(200).json({
      orders,
      meta: {
        total: totalOrders,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    return res.status(500).json({
      message: "Error fetching user orders",
      error: error.message,
    });
  }
}

async function getOrderById(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;

    const order = await orderModel.findById(id).exec();

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        error: "No order found with the given ID",
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== user.id.toString()) {
      return res.status(404).json({
        message: "Order not found",
        error: "No order found with the given ID",
      });
    }

    // Build timeline from timestamps
    const timeline = [
      {
        type: "CREATED",
        at: order.createdAt,
        description: "Order placed",
      },
    ];

    // Add status-based timeline events
    if (order.status === "CONFIRMED") {
      timeline.push({
        type: "CONFIRMED",
        at: order.updatedAt,
        description: "Order confirmed",
      });
    } else if (order.status === "SHIPPED") {
      timeline.push(
        {
          type: "CONFIRMED",
          at: order.updatedAt,
          description: "Order confirmed",
        },
        {
          type: "SHIPPED",
          at: order.updatedAt,
          description: "Order shipped",
        }
      );
    } else if (order.status === "DELIVERD") {
      timeline.push(
        {
          type: "CONFIRMED",
          at: order.updatedAt,
          description: "Order confirmed",
        },
        {
          type: "SHIPPED",
          at: order.updatedAt,
          description: "Order shipped",
        },
        {
          type: "DELIVERED",
          at: order.updatedAt,
          description: "Order delivered",
        }
      );
    } else if (order.status === "CANCELLED") {
      timeline.push({
        type: "CANCELLED",
        at: order.updatedAt,
        description: "Order cancelled",
      });
    }

    // Calculate payment summary
    const subtotal = order.items.reduce((sum, item) => {
      return sum + item.price.amount * item.quantity;
    }, 0);

    const taxRate = 0.1;
    const shippingCost = 50;
    const taxes = subtotal * taxRate;
    const total = order.totalPrice.amount;

    const paymentSummary = {
      subtotal,
      taxes,
      shipping: shippingCost,
      total,
      currency: order.totalPrice.currency,
    };

    return res.status(200).json({
      order: {
        ...order.toObject(),
        timeline,
        paymentSummary,
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    return res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
