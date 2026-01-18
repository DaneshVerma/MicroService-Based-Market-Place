// Mock RabbitMQ broker to prevent connection errors in tests
jest.mock('../../src/broker/broker', () => ({
    connect: jest.fn().mockResolvedValue(undefined),
    publishToQueue: jest.fn().mockResolvedValue(undefined),
    subscribeToQueue: jest.fn().mockResolvedValue(undefined),
}));
