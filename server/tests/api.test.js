const request = require('supertest');
const app = require('../server');

describe('E-Commerce API Tests', () => {
    // Product Tests
    describe('Products', () => {
        test('GET /api/products should return all products', async () => {
            const response = await request(app).get('/api/products');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.products).toBeInstanceOf(Array);
            expect(response.body.products.length).toBeGreaterThan(0);
        });

        test('GET /api/products/:id should return single product', async () => {
            const response = await request(app).get('/api/products/1');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.product).toHaveProperty('id', 1);
            expect(response.body.product).toHaveProperty('name');
            expect(response.body.product).toHaveProperty('price');
        });

        test('GET /api/products/:id should return 404 for non-existent product', async () => {
            const response = await request(app).get('/api/products/999');
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        test('GET /api/products should filter by category', async () => {
            const response = await request(app).get('/api/products?category=Electronics');
            expect(response.status).toBe(200);
            expect(response.body.products.every(p => p.category === 'Electronics')).toBe(true);
        });
    });

    // Cart Tests
    describe('Cart', () => {
        test('GET /api/cart should return empty cart initially', async () => {
            // Clear cart first
            await request(app).delete('/api/cart');
            const response = await request(app).get('/api/cart');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.cart).toHaveLength(0);
        });

        test('POST /api/cart should add item to cart', async () => {
            await request(app).delete('/api/cart');
            const response = await request(app)
                .post('/api/cart')
                .send({ productId: 1, quantity: 2 });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('POST /api/cart should return 404 for non-existent product', async () => {
            const response = await request(app)
                .post('/api/cart')
                .send({ productId: 999, quantity: 1 });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        test('PUT /api/cart/:productId should update quantity', async () => {
            await request(app).delete('/api/cart');
            await request(app).post('/api/cart').send({ productId: 1, quantity: 1 });
            const response = await request(app)
                .put('/api/cart/1')
                .send({ quantity: 5 });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('DELETE /api/cart/:productId should remove item', async () => {
            await request(app).delete('/api/cart');
            await request(app).post('/api/cart').send({ productId: 1, quantity: 1 });
            const response = await request(app).delete('/api/cart/1');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('DELETE /api/cart should clear entire cart', async () => {
            await request(app).post('/api/cart').send({ productId: 1, quantity: 1 });
            const response = await request(app).delete('/api/cart');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.cart).toHaveLength(0);
        });
    });

    // Order Tests
    describe('Orders', () => {
        test('POST /api/orders should create order', async () => {
            await request(app).delete('/api/cart');
            await request(app).post('/api/cart').send({ productId: 1, quantity: 2 });

            const response = await request(app)
                .post('/api/orders')
                .send({
                    customerName: 'Test User',
                    email: 'test@example.com',
                    address: '123 Test Street'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.order).toHaveProperty('id');
            expect(response.body.order).toHaveProperty('total');
        });

        test('POST /api orders should fail with empty cart', async () => {
            await request(app).delete('/api/cart');
            const response = await request(app)
                .post('/api/orders')
                .send({
                    customerName: 'Test User',
                    email: 'test@example.com',
                    address: '123 Test Street'
                });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('POST /api/orders should fail with missing fields', async () => {
            await request(app).delete('/api/cart');
            await request(app).post('/api/cart').send({ productId: 1, quantity: 1 });

            const response = await request(app)
                .post('/api/orders')
                .send({ customerName: 'Test User' });

            expect(response.status).toBe(400);
        });

        test('GET /api/orders should return all orders', async () => {
            const response = await request(app).get('/api/orders');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.orders).toBeInstanceOf(Array);
        });
    });

    // Health & Info Tests
    describe('Health & Info', () => {
        test('GET /api/health should return health status', async () => {
            const response = await request(app).get('/api/health');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });

        test('GET /api/info should return application info', async () => {
            const response = await request(app).get('/api/info');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('app', 'E-Commerce Store');
            expect(response.body).toHaveProperty('features');
        });

        test('GET /api/metrics should return metrics', async () => {
            const response = await request(app).get('/api/metrics');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('totalProducts');
            expect(response.body).toHaveProperty('totalOrders');
        });

        test('GET / should serve the frontend', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
        });
    });
});
