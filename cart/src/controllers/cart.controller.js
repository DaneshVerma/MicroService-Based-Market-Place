const cartModel = require("../models/cart.model");

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
module.exports = { addItemToCart };
