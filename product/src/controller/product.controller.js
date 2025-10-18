const Product = require("../models/product.model");
const uploadImages = require("../services/imagekit.service.js");

async function createProduct(req, res) {
  try {
    const { title, description, priceAmount, priceCurrency = "INR" } = req.body;
    if (!title || !description || !priceAmount) {
      return res
        .status(400)
        .json({ message: "Title, description and price are required" });
    }
    const seller = req.user.id;
    console.log("Seller ID:", seller);
    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
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
      title,
      description,
      price,
      images,
      seller,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
};
