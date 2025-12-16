// Global test setup for Cart service
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

// Optionally could set NODE_ENV
afterAll(() => {
  // cleanup hooks if needed later
});
