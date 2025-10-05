const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  email: {
    required: true,
    type: String,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: { type: String, select: false },
  role: {
    type: String,
    enum: ["seller", "user"],
  },
  addresses: [addressSchema],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
