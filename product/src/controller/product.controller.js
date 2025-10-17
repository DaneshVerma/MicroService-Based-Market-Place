const Product = require("../models/product.model");
const uploadImages = require("../services/imagekit.service.js");

async function createProduct(req, res) {
  try {
    const { name, description, priceAmount, PriceCurrency = "INR" } = req.body;
    if (!name || !description || !priceAmount) {
      return res
        .status(400)
        .json({ message: "Name, description and price are required" });
    }
    const seller = req.user.id;

    const price = {
      amount: Number(priceAmount),
      currency: PriceCurrency,
    };
    const images = [];
    await Promise.all(
      req.files.map(async (file) => {
        const imageUrl = await uploadImages({
          buffer: file.buffer,
          filename: file.originalname,
        });
        images.push(imageUrl);
      })
    );
    const product = await Product.create({
      name,
      description,
      price,
      images,
      seller,
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
};
