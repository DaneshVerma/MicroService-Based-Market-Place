const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock imagekit service to avoid importing ESM-only uuid during tests
jest.mock('../src/services/imagekit.service', () => ({
    uploadImage: jest.fn(async () => ({ url: 'https://ik.mock/x', thumbnail: 'https://ik.mock/t', id: 'file_x' })),
}));

const app = require('../src/app');
const Product = require('../src/models/product.model');


describe('GET /api/products', () => {
    let mongo;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        process.env.MONGO_URI = uri;
        await mongoose.connect(uri);
        // Ensure text indexes for $text search are available
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
            title: overrides.title ?? 'Sample Product',
            description: overrides.description ?? 'A great product',
            price: overrides.price ?? { amount: 100, currency: 'USD' },
            seller: overrides.seller ?? new mongoose.Types.ObjectId(),
            images: overrides.images ?? [],
        });
    };

    it('returns empty list when no products exist', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body?.data)).toBe(true);
        expect(res.body.data.length).toBe(0);
    });

    it('returns all products', async () => {
        await Promise.all([
            createProduct({ title: 'P1' }),
            createProduct({ title: 'P2' }),
            createProduct({ title: 'P3' }),
        ]);
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(3);
    });

    it('supports text search via q parameter', async () => {
        await Promise.all([
            createProduct({ title: 'Red Shirt', description: 'Cotton' }),
            createProduct({ title: 'Blue Shirt', description: 'Wool' }),
            createProduct({ title: 'Green Pants', description: 'Linen' }),
        ]);

        const res = await request(app).get('/api/products').query({ q: 'shirt' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        // Sanity check that only shirts are returned
        const titles = res.body.data.map(p => p.title).sort();
        expect(titles).toEqual(expect.arrayContaining([ 'Red Shirt', 'Blue Shirt' ]));
    });

    it('filters by minprice and maxprice', async () => {
        await Promise.all([
            createProduct({ title: 'Low', price: { amount: 50, currency: 'USD' } }),
            createProduct({ title: 'Mid', price: { amount: 100, currency: 'USD' } }),
            createProduct({ title: 'High', price: { amount: 150, currency: 'USD' } }),
        ]);

        let res = await request(app).get('/api/products').query({ minprice: '75' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);

        res = await request(app).get('/api/products').query({ maxprice: '120' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);

        res = await request(app).get('/api/products').query({ minprice: '60', maxprice: '120' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[ 0 ].title).toBe('Mid');
    });

    it('supports pagination with skip and limit', async () => {
        // Insert 5 products
        await Promise.all([
            createProduct({ title: 'P1' }),
            createProduct({ title: 'P2' }),
            createProduct({ title: 'P3' }),
            createProduct({ title: 'P4' }),
            createProduct({ title: 'P5' }),
        ]);

        let res = await request(app).get('/api/products').query({ limit: '2' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);

        res = await request(app).get('/api/products').query({ skip: '2', limit: '2' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);

        res = await request(app).get('/api/products').query({ skip: '4', limit: '2' });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
    });
});
