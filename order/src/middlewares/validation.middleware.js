const { body, param, validationResult } = require("express-validator");
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

const validateUpdateCartItem = [
  param("productId")
    .isString()
    .withMessage("Product ID must be a string")
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid Product ID format"),
  body("qty")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
  validateResult,
];

const validateCreateOrder = [
  body("shippingAddress").exists().withMessage("Shipping address is required"),
  body("shippingAddress.street")
    .notEmpty()
    .withMessage("Street is required")
    .isString()
    .withMessage("Street must be a string"),
  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  body("shippingAddress.state")
    .notEmpty()
    .withMessage("State is required")
    .isString()
    .withMessage("State must be a string"),
  body("shippingAddress.pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .isString()
    .withMessage("Pincode must be a string"),
  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string"),
  validateResult,
];

module.exports = {
  validateAddIeItemToCart,
  validateUpdateCartItem,
  validateCreateOrder,
};
