const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../src/config/environments");

/**
 * Assumptions made in these tests:
 * - API base path is /api/auth (matches the rest of the test-suite).
 * - Address documents include `street, city, state, zip, country, pincode, phone`.
 * - An `isDefault` boolean marks the default address when listing.
 * - POST /users/me/addresses returns the created address (201) or 400 with { errors: [...] } on validation.
 * - DELETE /users/me/addresses/:addressId returns 200 and a message on success.
 *
 * If your implementation uses different field names or shapes, adjust the tests accordingly.
 */

describe("Addresses API", () => {
  let user;
  let token;

  beforeEach(async () => {
    await User.deleteMany({});

    user = await User.create({
      username: "addr_test_user",
      email: "addruser@example.com",
      password: "hashedpassword",
      fullName: { firstName: "Addr", lastName: "Tester" },
      role: "user",
      addresses: [
        {
          street: "1 Test Lane",
          city: "Testville",
          state: "TS",
          zip: "11111",
          country: "Testland",
          pincode: "123456",
          phone: "9998887777",
          isDefault: true,
        },
      ],
    });

    token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      config.JWT_SECRET || "testsecret",
      { expiresIn: "1d" }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  test("GET /api/auth/users/me/addresses - returns addresses and marks default", async () => {
    const res = await request(app)
      .get("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body.addresses)).toBe(true);
    expect(res.body.addresses.length).toBeGreaterThanOrEqual(1);
    const addr = res.body.addresses[0];
    expect(addr).toMatchObject({
      street: "1 Test Lane",
      city: "Testville",
      state: "TS",
      zip: "11111",
      country: "Testland",
      pincode: "123456",
      phone: "9998887777",
    });
    // default marking
    expect(addr).toHaveProperty("isDefault");
  });

  test("POST /api/auth/users/me/addresses - adds address with valid pincode and phone", async () => {
    const newAddr = {
      street: "2 New St",
      city: "Newcity",
      state: "NC",
      zip: "22222",
      country: "Newland",
      pincode: "654321",
      phone: "8887776666",
    };

    const res = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(newAddr)
      .expect(201);

    expect(res.body).toHaveProperty("address");
    const created = res.body.address;
    expect(created).toMatchObject({
      street: newAddr.street,
      city: newAddr.city,
      state: newAddr.state,
      zip: newAddr.zip,
      country: newAddr.country,
      pincode: newAddr.pincode,
      phone: newAddr.phone,
    });

    const dbUser = await User.findById(user._id);
    expect(dbUser.addresses.length).toBeGreaterThanOrEqual(2);
  });

  test("POST validation - invalid pincode returns 400", async () => {
    const badAddr = {
      street: "3 Bad",
      city: "Badcity",
      state: "BC",
      zip: "33333",
      country: "Badland",
      pincode: "abc", // invalid
      phone: "7776665555",
    };

    const res = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(badAddr)
      .expect(400);

    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(
      res.body.errors.some((e) => /pincode|zip/i.test(e.msg || e.message || ""))
    ).toBe(true);
  });

  test("POST validation - invalid phone returns 400", async () => {
    const badAddr = {
      street: "4 Bad",
      city: "Badcity",
      state: "BC",
      zip: "44444",
      country: "Badland",
      pincode: "123456",
      phone: "not-a-number",
    };

    const res = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(badAddr)
      .expect(400);

    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(
      res.body.errors.some((e) => /phone/i.test(e.msg || e.message || ""))
    ).toBe(true);
  });

  test("DELETE /api/auth/users/me/addresses/:addressId - removes address", async () => {
    // take one address id from DB
    const dbUser = await User.findById(user._id);
    const addressId = dbUser.addresses[0]._id;

    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${addressId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("message");

    const after = await User.findById(user._id);
    expect(
      after.addresses.find((a) => String(a._id) === String(addressId))
    ).toBeUndefined();
  });
});
