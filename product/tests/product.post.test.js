const path = require('path');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('../src/services/imagekit.service', () => ({
    uploadImage: jest.fn(async ({ filename }) => ({
        url: `https://ik.mock/${filename}`,
        thumbnail: `https://ik.mock/thumb/${filename}`,
        id: `file_${filename}`,
    })),
}));

const app = require('../src/app');

describe('POST /api/products', () => {
    let mongo;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        process.env.MONGO_URI = uri;
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    });

    afterEach(async () => {
        const collections = await mongoose.connection.db.collections();
        for (const c of collections) await c.deleteMany({});
    });

    it('creates a product and uploads images', async () => {
        const token = jwt.sign({ id: new mongoose.Types.ObjectId().toHexString(), role: 'seller' }, process.env.JWT_SECRET);
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Test Product')
            .field('description', 'Nice one')
            .field('priceAmount', '99.99')
            .field('priceCurrency', 'USD')
            .attach('images', path.join(__dirname, 'fixtures', 'sample.jpg'));

        expect(res.status).toBe(201);
        expect(res.body?.data?.title).toBe('Test Product');
        expect(res.body?.data?.price?.amount).toBe(99.99);
        expect(res.body?.data?.images?.length).toBe(1);
        expect(res.body?.data?.images[ 0 ]?.url).toContain('https://ik.mock/');
    });

    it('validates required fields', async () => {
        const token = jwt.sign({ id: new mongoose.Types.ObjectId().toHexString(), role: 'seller' }, process.env.JWT_SECRET);
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'X');
        expect(res.status).toBe(400);
    });
});
