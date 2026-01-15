const { publishToQueue } = require("../broker/broker.js");
const productModel = require("../models/product.model");
const {
  uploadImages,
  deleteImage,
} = require("../services/imagekit.service.js");
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
        const imageData = await uploadImages({
          buffer: file.buffer,
          filename: file.originalname,
        });
        images.push({
          url: imageData.url,
          thumbnail: imageData.thumbnailUrl,
          fileId: imageData.fileId,
        });
      })
    );
    const product = await productModel.create({
      title,
      description,
      price,
      images,
      seller,
    });

  await publishToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED", product);
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

async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await productModel.findOne({
      _id: id,
      seller: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.seller.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this product" });
    }
    Promise.all(
      product.images.map(async (image) => {
        await deleteImage(image.fileId);
      })
    );
    await productModel.deleteOne({ _id: id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductsBySeller(req, res) { 
  const seller = req.user
  const {skip = 0, limit = 20} = req.query
  try { 
    const products = await productModel.find({seller:seller.id}).skip(Number(skip)).limit(Math.min(Number(limit), 20));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct, 
  getProductsBySeller,
};
