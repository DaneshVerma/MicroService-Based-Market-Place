const request = require("supertest");
const app = require("../src/app");
const redis = require("../src/db/redis.db");

// Mock the Redis client
jest.mock("../src/db/redis.db", () => ({
  set: jest.fn().mockResolvedValue("OK"),
}));

describe("POST /api/auth/logout", () => {
  const testToken = "test-jwt-token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully logout with a valid token", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", `token=${testToken}`)
      .expect(200);

    expect(response.body).toEqual({
      message: "Logout successful",
    });

    // Verify Redis blacklist was called with the correct token
    expect(redis.set).toHaveBeenCalledWith(
      `blacklist_marketPlace_token:${testToken}`,
      true,
      "EX",
      24 * 60 * 60
    );

    // Verify cookie was cleared
    const cookieHeader = response.headers["set-cookie"][0];
    expect(cookieHeader).toContain("token=");
    expect(cookieHeader.toLowerCase()).toContain("expires=thu, 01 jan 1970");
  });

  it("should handle logout without a token", async () => {
    const response = await request(app).post("/api/auth/logout").expect(200);

    expect(response.body).toEqual({
      message: "Logout successful",
    });

    // Verify Redis was not called when no token is present
    expect(redis.set).not.toHaveBeenCalled();
  });

  it("should handle Redis errors", async () => {
    // Mock Redis to throw an error
    redis.set.mockRejectedValueOnce(new Error("Redis error"));

    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", `token=${testToken}`)
      .expect(400);

    expect(response.body).toEqual({
      message: "Redis error",
    });
  });
});
