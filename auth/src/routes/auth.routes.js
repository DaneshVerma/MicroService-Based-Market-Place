const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const {
  registerUserValidation,
  loginValidation,
} = require("../middlewares/validator.middleware");

const router = express.Router();

router.post("/register", registerUserValidation, register);
router.post("/login", loginValidation, login);
module.exports = router;
