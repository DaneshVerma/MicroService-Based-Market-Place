const cartModel = require("../models/cart.model");

async function getCart(req, res) {
  const user = req.user;

  let cart = await cartModel.findOne({ user: user._id });
  if (!cart) {
    cart = new cartModel({ user: user._id, items: [] });
    await cart.save();
  }
  res.status(200).json({
    cart,
    totals: {
      itemCount: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });
}

async function addItemToCart(req, res) {
  const { productId, qty } = req.body;
  const user = req.user;

  let cart = await cartModel.findOne({
    user: user._id,
  });
  if (!cart) cart = new cartModel({ user: user._id, items: [] });

  const existingItemindex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (existingItemindex >= 0) {
    cart.items[existingItemindex].quantity += qty;
  } else cart.items.push({ productId, quantity: qty });

  await cart.save();

  res.status(200).json({
    message: "Item added to cart",
    cart,
  });
}

async function updateCartItem(req, res) {
  const { productId } = req.params;
  const { qty } = req.body;
  const user = req.user;

  const cart = await cartModel.findOne({ user: user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cart.items[itemIndex].quantity = qty;
  await cart.save();

  res.status(200).json({
    message: "Item updated",
    cart,
  });
}

module.exports = { addItemToCart, updateCartItem, getCart };
