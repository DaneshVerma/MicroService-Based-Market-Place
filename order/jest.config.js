module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup/env.js",
    "<rootDir>/src/tests/setup/mongodb.js",
  ],
};
