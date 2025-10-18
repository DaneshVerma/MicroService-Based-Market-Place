const productModel = require("../models/product.model");
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
    const product = await productModel.create({
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
async function getProducts(req, res) {
  try {
    const { q, minPrice, maxPrice, skip = 0, limit = 20 } = req.query;
    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (minPrice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $gte: Number(minPrice),
      };
    }
    if (maxPrice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $lte: Number(maxPrice),
      };
    }
    const products = await productModel.find(filter).skip(skip).limit(limit);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
};
