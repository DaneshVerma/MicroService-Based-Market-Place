const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/environments");
const redis = require("../db/redis.db");
const { publishToQueue } = require("../broker/broker");

async function register(req, res) {
  try {
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

    // Publish user created event to message broker (rabbitmq)
    await publishToQueue("auth_notification_user_created", { userId: user._id, email: user.email, username: user.username, fullName: `${user.fullName.firstName} ${user.fullName.lastName}` });


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

    return res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password, username } = req.body;
    if (!email && !username) {
      return res
        .status(400)
        .json({ message: "Either email or username is required" })
        .message("Either email or username is required");
    }
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials" })
        .message("Invalid credentials");
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid credentials" })
        .message("Invalid credentials");
    }
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
    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(400).message(error.message);
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -__v -refreshTokens"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User found",
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
async function logout(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await redis.set(
        `blacklist_marketPlace_token:${token}`,
        true,
        "EX",
        24 * 60 * 60
      );
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// Address handlers
async function getAddresses(req, res) {
  try {
    console.log("getAddresses called for", req.user && req.user.id);
    const user = await User.findById(req.user.id).select("addresses");
    console.log("getAddresses found user?", !!user);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("getAddresses returning", user.addresses.length);
    return res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.log("getAddresses error", error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function addAddress(req, res) {
  console.log("addAddress called", {
    user: req.user && req.user.id,
    body: req.body,
  });
  try {
    const { street, city, state, zip, country, pincode, phone, isDefault } =
      req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // if isDefault, unset existing defaults
    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    const addr = {
      street,
      city,
      state,
      zip,
      country,
      pincode,
      phone,
      isDefault: !!isDefault,
    };
    user.addresses.push(addr);
    await user.save();

    const created = user.addresses[user.addresses.length - 1];
    console.log("addAddress returning created id", created._id);
    return res.status(201).json({ address: created });
  } catch (error) {
    console.log("addAddress error", error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const before = user.addresses.length;
    user.addresses = user.addresses.filter(
      (a) => String(a._id) !== String(addressId)
    );
    if (user.addresses.length === before) {
      console.log("deleteAddress: address not found");
      return res.status(404).json({ message: "Address not found" });
    }
    await user.save();
    console.log("deleteAddress: removed, remaining", user.addresses.length);
    return res.status(200).json({ message: "Address removed" });
  } catch (error) {
    console.log("deleteAddress error", error.message);
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  getAddresses,
  addAddress,
  deleteAddress,
};
