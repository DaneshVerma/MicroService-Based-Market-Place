const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  country: { type: String },
  // added fields used by tests
  pincode: { type: String },
  phone: { type: String },
  isDefault: { type: Boolean, default: false },
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
