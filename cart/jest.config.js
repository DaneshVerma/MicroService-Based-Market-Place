module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/globalSetup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
};
