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
router.get("/logout", logout);

module.exports = router;
  