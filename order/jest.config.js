/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    setupFiles: ['<rootDir>/tests/setup/env.js'],
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup/mongodb.js',
        '<rootDir>/tests/setup/broker.mock.js',
        '<rootDir>/tests/setup/axios-mock.js'
    ],
};
