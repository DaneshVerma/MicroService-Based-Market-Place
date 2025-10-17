const Product = require("../models/product.model");
const uploadImages  = require("../utils/imagekit.service.js");


async function createProduct(req, res) {
  try {
    const { name, description, priceAmount, PriceCurrency = "INR" } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: "Title and Price are required" });
    }
    const seller = req.user.id;

    const price = {
      amount: Number(priceAmount),
      currency: PriceCurrency,
    };
    const images = [];
    const files = await promise.all(
      req.files.map(async (file) => {
        const imageUrl = await uploadImages({
          buffer: file.buffer,
          filename: file.originalname,
        });
        images.push(imageUrl);
      })
    );
    

  } catch (error) {}
}
