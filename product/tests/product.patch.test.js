const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock imagekit service to avoid ESM uuid import during tests
jest.mock('../src/services/imagekit.service', () => ({
    uploadImage: jest.fn(async () => ({ url: 'https://ik.mock/x', thumbnail: 'https://ik.mock/t', id: 'file_x' })),
}));

const app = require('../src/app');
const Product = require('../src/models/product.model');

describe('PATCH /api/products/:id (SELLER)', () => {
    let mongo;
    let sellerId1;
    let sellerId2;

    const signToken = (id, role = 'seller') => jwt.sign({ id, role }, process.env.JWT_SECRET);

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        process.env.MONGO_URI = uri;
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
        await mongoose.connect(uri);
        await Product.syncIndexes();

        sellerId1 = new mongoose.Types.ObjectId();
        sellerId2 = new mongoose.Types.ObjectId();
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
            title: overrides.title ?? 'Patch Target',
            description: overrides.description ?? 'To be updated',
            price: overrides.price ?? { amount: 10, currency: 'USD' },
            seller: overrides.seller ?? sellerId1,
            images: overrides.images ?? [],
        });
    };

    it('requires authentication (401) when no token provided', async () => {
        const prod = await createProduct();
        const res = await request(app)
            .patch(`/api/products/${prod._id}`)
            .send({ title: 'Nope' });
        expect(res.status).toBe(401);
    });

    it('requires seller role (403) when role is not seller', async () => {
        const prod = await createProduct();
        const token = signToken(sellerId1.toHexString(), 'user');
        const res = await request(app)
            .patch(`/api/products/${prod._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Nope' });
        expect(res.status).toBe(403);
    });

    it('returns 403 for invalid product id', async () => {
        const token = signToken(sellerId1.toHexString(), 'seller');
        const res = await request(app)
            .patch('/api/products/not-a-valid-id')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'X' });
        expect(res.status).toBe(400);
    });

    it('returns 404 when product not found', async () => {
        const token = signToken(sellerId1.toHexString(), 'seller');
        const missingId = new mongoose.Types.ObjectId().toHexString();
        const res = await request(app)
            .patch(`/api/products/${missingId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'New' });
        expect(res.status).toBe(404);
    });

    it("forbids updating another seller's product (403)", async () => {
        const otherProd = await createProduct({ seller: sellerId2 });
        const token = signToken(sellerId1.toHexString(), 'seller');
        const res = await request(app)
            .patch(`/api/products/${otherProd._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Hack' });
        expect(res.status).toBe(403);
    });

    it('updates allowed fields and returns updated product (200)', async () => {
        const prod = await createProduct({ title: 'Old', description: 'OldDesc', price: { amount: 10, currency: 'USD' } });
        const token = signToken(sellerId1.toHexString(), 'seller');
        const payload = { title: 'New', description: 'NewDesc', price: { amount: 25, currency: 'USD' } };

        const res = await request(app)
            .patch(`/api/products/${prod._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(payload);

        expect(res.status).toBe(200);
        const body = res.body || {};
        const updated = body.data || body.product; // accept either key while implementing
        expect(updated).toBeTruthy();
        expect(updated.title).toBe('New');
        expect(updated.description).toBe('NewDesc');
        expect(updated.price.amount).toBe(25);
    });
});
