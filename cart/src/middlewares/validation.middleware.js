const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

function validateResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

const validateAddIeItemToCart = [
  body("productId")
    .isString()
    .withMessage("Product ID must be a string")
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid Product ID format"),
  body("qty")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
  validateResult,
];

module.exports = {validateAddIeItemToCart};
