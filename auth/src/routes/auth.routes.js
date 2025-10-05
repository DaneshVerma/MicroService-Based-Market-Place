const express = require("express");
const { register } = require("../controllers/auth.controller");
const { registerUserValidation } = require("../middlewares/validator.middleware");

const router = express.Router();

router.post("/register", registerUserValidation, register);

module.exports = router;
