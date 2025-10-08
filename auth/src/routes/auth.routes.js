const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  logout,
} = require("../controllers/auth.controller");
const {
  registerUserValidation,
  loginValidation,
} = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUserValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", logout);
// Addresses
const { addressValidation } = require("../middlewares/validator.middleware");
const {
  getAddresses,
  addAddress,
  deleteAddress,
} = require("../controllers/auth.controller");

router.get("/users/me/addresses", authMiddleware, getAddresses);
router.post(
  "/users/me/addresses",
  authMiddleware,
  addressValidation,
  addAddress
);
router.delete("/users/me/addresses/:addressId", authMiddleware, deleteAddress);

module.exports = router;
