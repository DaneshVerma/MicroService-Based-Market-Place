const axios = require('axios');

// Mock axios for all tests
jest.mock('axios');

beforeEach(() => {
    // Reset mocks before each test
    axios.get.mockReset();
    axios.post.mockReset();
    axios.delete.mockReset();
    axios.patch.mockReset();

    // Default mock implementations
    // Mock cart service GET /api/cart
    axios.get.mockImplementation((url) => {
        if (url === 'http://localhost:3002/api/cart') {
            return Promise.resolve({
                data: {
                    cart: {
                        items: [
                            {
                                productId: '507f1f77bcf86cd799439011',
                                quantity: 2,
                            },
                            {
                                productId: '507f1f77bcf86cd799439012',
                                quantity: 1,
                            },
                        ],
                    },
                    totals: {
                        itemCount: 2,
                        totalQuantity: 3,
                    },
                },
            });
        }

        // Mock product service GET /api/products/:id
        if (url.startsWith('http://localhost:3001/api/products/')) {
            const productId = url.split('/').pop();
            return Promise.resolve({
                data: {
                    data: {
                        _id: productId,
                        title: `Product ${productId}`,
                        description: 'Test product',
                        price: {
                            amount: 100,
                            currency: 'USD',
                        },
                        stock: 10,
                    },
                },
            });
        }

        return Promise.reject(new Error(`Unmocked GET request: ${url}`));
    });

    // Mock cart service DELETE /api/cart
    axios.delete.mockImplementation((url) => {
        if (url === 'http://localhost:3002/api/cart') {
            return Promise.resolve({
                data: { message: 'Cart cleared' },
            });
        }
        return Promise.reject(new Error(`Unmocked DELETE request: ${url}`));
    });
});
