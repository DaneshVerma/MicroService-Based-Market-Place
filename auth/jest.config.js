/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  clearMocks: true,
};
