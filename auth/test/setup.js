const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock RabbitMQ broker to prevent connection errors in tests
jest.mock('../src/broker/broker', () => ({
    connect: jest.fn().mockResolvedValue(undefined),
    publishToQueue: jest.fn().mockResolvedValue(undefined),
    subscribeToQueue: jest.fn().mockResolvedValue(undefined),
}));

let mongo;

beforeAll(async () => {
    // Start in-memory MongoDB
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    process.env.MONGO_URI = uri; // ensure app's db connector uses this
    process.env.JWT_SECRET = "test_jwt_secret"; // set a test JWT secret

    await mongoose.connect(uri);
});

afterEach(async () => {
    // Cleanup all collections between tests
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) await mongo.stop();
});
