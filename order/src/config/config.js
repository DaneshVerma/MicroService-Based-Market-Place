module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "test-secret",
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || "token",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/order-service",
  PORT: process.env.PORT || 3000,
};
