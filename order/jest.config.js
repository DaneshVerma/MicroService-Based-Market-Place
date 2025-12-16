module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!tests/**", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterEnv: [
    "<rootDir>/tests/setup/env.js",
    "<rootDir>/tests/setup/mongodb.js",
    "<rootDir>/tests/setup/axios-mock.js",
  ],
};
