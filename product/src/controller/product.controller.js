const productModel = require("../models/product.model");
const uploadImages = require("../services/imagekit.service.js");
const mongoose = require("mongoose");

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

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await productModel.findOne({
      _id: id,
      seller: req.user.id,
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found ",
      });
    }
    const allowedUpdates = ["title", "description", "price"];
    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) {
        if (key === "price" && typeof req.body[key] === "object") {
          const { amount, currency } = req.body[key];
          if (amount) {
            console.log("Amount to update:", amount);
            product.price.amount = Number(amount);
          }
          if (currency) {
            product.price.currency = currency;
          }
        } else {
          product[key] = req.body[key];
        }
      }
    }
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
};
