const request = require('supertest');
const app = require('../../src/app');
const { getAuthCookie } = require('../setup/auth');



describe('GET /api/orders/me — Paginated list of the customer’s orders', () => {
    it('returns paginated orders with meta and defaults page=1, limit=20', async () => {
        const res = await request(app)
            .get('/api/orders/me')
            .set('Cookie', getAuthCookie())
            .expect('Content-Type', /json/)
            .expect(200);

        const body = res.body;
        expect(body).toBeDefined();
        const items = body.orders || body.items || body.data || [];
        expect(Array.isArray(items)).toBe(true);

        const meta = body.meta || body.pagination || {};
        expect(meta).toBeDefined();
        expect(typeof (meta.page ?? 1)).toBe('number');
        expect(typeof (meta.limit ?? 20)).toBe('number');
        expect(typeof (meta.total ?? 0)).toBe('number');
    });

    it('respects page and limit query parameters', async () => {
        const res = await request(app)
            .get('/api/orders/me?page=2&limit=5')
            .set('Cookie', getAuthCookie())
            .expect('Content-Type', /json/)
            .expect(200);

        const meta = res.body.meta || res.body.pagination || {};
        expect([ 2, '2' ]).toContain(meta.page);
        expect([ 5, '5' ]).toContain(meta.limit);
    });

    it('returns empty list when user has no orders', async () => {
        const res = await request(app)
            .get('/api/orders/me')
            .set('Cookie', getAuthCookie({ userId: '507f1f77bcf86cd799439099' }))
            .expect('Content-Type', /json/)
            .expect(200);

        const items = res.body.orders || res.body.items || res.body.data || [];
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBe(0);
    });
});
