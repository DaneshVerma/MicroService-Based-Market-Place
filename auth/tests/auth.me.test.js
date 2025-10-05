const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../src/config/environments");

describe("GET /api/auth/me", () => {
  let user;
  let token;

  // Create a test user and get a valid token before running tests
  beforeAll(async () => {
    // Clear any existing test data
    await User.deleteMany({});

    // Create a test user
    user = await User.create({
      username: "testuser_me",
      email: "me@example.com",
      password: "hashedpassword",
      fullName: {
        firstName: "Test",
        lastName: "User"
      },
      role: "user"
    });

    // Generate a valid JWT token
    token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      config.JWT_SECRET,
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
  });

  it("should return user details with valid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.username).toBe(user.username);
    expect(response.body.email).toBe(user.email);
    expect(response.body).not.toHaveProperty('password'); // Password should not be returned
  });

  it("should return 401 without token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .expect(401);

    expect(response.body).toHaveProperty('message', 'No token provided');
  });

  it("should return 401 with invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set('Authorization', 'Bearer invalidtoken123')
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  it("should return 401 with expired token", async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '-1s' } // Expired 1 second ago
    );

    const response = await request(app)
      .get("/api/auth/me")
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Token expired');
  });

 
});
