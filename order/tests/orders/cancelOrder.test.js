const request = require('supertest');
const app = require('../../src/app');
const { getAuthCookie } = require('../setup/auth');
const orderModel = require('../../src/models/order.model');


describe('POST /api/orders/:id/cancel — Buyer-initiated cancel while rules apply', () => {
    const orderId = '507f1f77bcf86cd799439012';

    beforeEach(async () => {
        await orderModel.deleteMany({});
    });

    it('cancels a PENDING order and returns updated order', async () => {

        const order = new orderModel({
            _id: orderId,
            user: '68bc6369c17579622cbdd9fe', // ensure this matches auth user
            status: 'PENDING',
            items: [
                {
                    product: '507f1f77bcf86cd799439021',
                    quantity: 1,
                    price: { amount: 100, currency: 'USD' },
                },
            ],
            totalPrice: { amount: 100, currency: 'USD' },
            shippingAddress: {
                street: '123 Main St',
                city: 'Metropolis',
                state: 'CA',
                zip: '90210',
                country: 'USA',
            },

        });
        await order.save();

        const res = await request(app)
            .post(`/api/orders/${orderId}/cancel`)
            .set('Cookie', getAuthCookie())
            .expect('Content-Type', /json/)
            .expect(200);


        const orderResponse = res.body.order || res.body.data || res.body;
        expect(orderResponse.status).toMatch(/CANCELLED|CANCELED/i);

    });

    it('returns 409 when order is not cancellable (e.g., SHIPPED or DELIVERED)', async () => {


        const order = new orderModel({
            _id: orderId,
            user: '68bc6369c17579622cbdd9fe', // ensure this matches auth user
            status: 'SHIPPED',
            items: [
                {
                    product: '507f1f77bcf86cd799439021',
                    quantity: 1,
                    price: { amount: 100, currency: 'USD' },
                },
            ],
            totalPrice: { amount: 100, currency: 'USD' },
            shippingAddress: {
                street: '123 Main St',
                city: 'Metropolis',
                state: 'CA',
                zip: '90210',
                country: 'USA',
            },

        });
        await order.save();

        const res = await request(app)
            .post(`/api/orders/${orderId}/cancel`)
            .set('Cookie', getAuthCookie())
            .expect('Content-Type', /json/)
            .expect(409);

        expect(res.body.error || res.body.message).toMatch(/cannot|not.*cancell/i);
    });

    it('returns 403 when user is not the owner of the order', async () => {

        const order = new orderModel({
            _id: orderId,
            user: '68bc6369c17579622cbdd9fe',
            items: [],
            status: 'PENDING',
            totalPrice: {
                amount: 0,
                currency: 'USD'
            },
            shippingAddress: {
                street: '123 Main St',
                city: 'Metropolis',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            }
        });

        await order.save();

        const res = await request(app)
            .post(`/api/orders/${orderId}/cancel`)
            .set('Cookie', getAuthCookie({ userId: '507f1f77bcf86cd799439099' }))
            .expect('Content-Type', /json/)
            .expect(403);

        expect(res.body.error || res.body.message).toMatch(/forbidden|not.*allowed/i);
    });
});
