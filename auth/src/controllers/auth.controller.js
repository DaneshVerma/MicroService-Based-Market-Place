const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/environments");
async function register(req, res, next) {
  const {
    username,
    email,
    password,
    fullName: { firstName, lastName },
    role,
    addresses,
  } = req.body;
  const isUserAlreadyExists = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName: { firstName, lastName },
    role,
    addresses,
  });
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res
    .status(201)
    .json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
}
module.exports = {
  register,
};
