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
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    match: "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/",
    required: true,
    type: String,
  },
  password: { type: String },
  role: {
    type: String,
    enum: ["seller", "user"],
  },
  addresses: {
    addressSchema,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel; 
