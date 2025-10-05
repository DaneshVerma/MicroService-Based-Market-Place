const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const User = require("../src/models/user.model");

describe("POST /api/auth/login", () => {
  const testUser = {
    username: "testuser",
    fullName: {
      firstName: "Test",
      lastName: "User",
    },
    email: "test@example.com",
    password: "password123",
    role: "user",
    addresses: [
      {
        street: "123 Test St",
        city: "Test City",
        state: "TS",
        zip: "12345",
        country: "USA",
      },
    ],
  };

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});

    // Create a test user with hashed password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await User.create({
      ...testUser,
      password: hashedPassword,
    });
  });

  it("should login successfully with valid email and password", async () => {
    const loginPayload = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toMatchObject({
      username: testUser.username,
      fullName: testUser.fullName,
      email: testUser.email,
      role: testUser.role,
    });
    expect(response.body.user).not.toHaveProperty("password");

    // Check if cookie is set (in a real scenario, you'd check the Set-Cookie header)
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toMatch(/token=/);
  });

  it("should login successfully with valid username and password", async () => {
    const loginPayload = {
      username: testUser.username,
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toMatchObject({
      username: testUser.username,
      fullName: testUser.fullName,
      email: testUser.email,
      role: testUser.role,
    });
  });

  it("should return 400 for non-existent user", async () => {
    const loginPayload = {
      email: "nonexistent@example.com",
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 400 for missing email/username", async () => {
    const loginPayload = {
      password: testUser.password,
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(loginPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      "Either email or username is required"
    );
  });
});
