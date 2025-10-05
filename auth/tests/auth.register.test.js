const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");

describe("POST /api/auth/register", () => {
  const basePayload = {
    username: "john_doe",
    fullName: {
      firstName: "John",
      lastName: "Doe",
    },
    email: "john@example.com",
    password: "password123",
    role: "user",
    addresses: [
      {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA",
      },
    ],
  };

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(basePayload);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user).toMatchObject({
      username: basePayload.username,
      fullName: basePayload.fullName,
      email: basePayload.email,
      role: basePayload.role,
    });
    expect(response.body.user).not.toHaveProperty("password");

    const userInDb = await User.findOne({ username: basePayload.username });
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(basePayload.email);
  });

  it("should not allow registration with existing username", async () => {
    await User.create({
      ...basePayload,
      email: "another@example.com",
      password: "hashedpassword",
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send(basePayload);

    expect(response.statusCode).toBe(409);
    expect(response.body).toMatchObject({ message: "User already exists" });
  });

  it("should return bad request when required fields are missing", async () => {
    const { username, ...invalidPayload } = basePayload;

    const response = await request(app)
      .post("/api/auth/register")
      .send(invalidPayload);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Username is required",
        }),
      ])
    );
  });
});
