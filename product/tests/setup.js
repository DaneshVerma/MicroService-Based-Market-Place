// Test setup for product service

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

// Mock RabbitMQ broker to prevent connection errors in tests
jest.mock('../src/broker/broker', () => ({
    connect: jest.fn().mockResolvedValue(undefined),
    publishToQueue: jest.fn().mockResolvedValue(undefined),
    subscribeToQueue: jest.fn().mockResolvedValue(undefined),
}));

