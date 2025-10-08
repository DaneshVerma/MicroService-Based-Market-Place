const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../src/config/environments");

(async () => {
  await User.deleteMany({});
  const user = await User.create({
    username: "dbg_user",
    email: "dbg@example.com",
    password: "hashed",
    fullName: { firstName: "Dbg", lastName: "User" },
    role: "user",
  });
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    config.JWT_SECRET || "testsecret",
    { expiresIn: "1d" }
  );

  const newAddr = {
    street: "X",
    city: "Y",
    state: "Z",
    zip: "00000",
    country: "C",
    pincode: "123456",
    phone: "9998887777",
  };

  const res = await request(app)
    .post("/api/auth/users/me/addresses")
    .set("Authorization", `Bearer ${token}`)
    .send(newAddr);
  console.log("STATUS", res.status);
  console.log("BODY", res.body);
  process.exit(0);
})();
