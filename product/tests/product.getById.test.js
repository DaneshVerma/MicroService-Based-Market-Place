const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock imagekit service to avoid ESM uuid import during tests
jest.mock('../src/services/imagekit.service', () => ({
    uploadImage: jest.fn(async () => ({ url: 'https://ik.mock/x', thumbnail: 'https://ik.mock/t', id: 'file_x' })),
}));

const app = require('../src/app');
const Product = require('../src/models/product.model');


describe('GET /api/products/:id', () => {
    let mongo;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        process.env.MONGO_URI = uri;
        await mongoose.connect(uri);
        await Product.syncIndexes();
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

    const createProduct = (overrides = {}) => {
        return Product.create({
            title: overrides.title ?? 'ById Product',
            description: overrides.description ?? 'Desc',
            price: overrides.price ?? { amount: 42, currency: 'USD' },
            seller: overrides.seller ?? new mongoose.Types.ObjectId(),
            images: overrides.images ?? [],
        });
    };

    it('returns 400 for invalid object id', async () => {
        const res = await request(app).get('/api/products/not-a-valid-id');
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/invalid product id/i);
    });

    it('returns 404 when product not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        const res = await request(app).get(`/api/products/${id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    it('returns product when found', async () => {
        const product = await createProduct({ title: 'Found Product' });
        const res = await request(app).get(`/api/products/${product._id}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?._id).toBe(product._id.toString());
        expect(res.body?.data?.title).toBe('Found Product');
    });
});
