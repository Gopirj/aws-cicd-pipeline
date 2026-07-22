const request = require('supertest');
const app = require('../src/server');

describe('API Tests', () => {
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
        expect(response.body).toHaveProperty('app');
        expect(response.body).toHaveProperty('pipeline', 'AWS CodePipeline');
    });

    test('GET /api/metrics should return metrics', async () => {
        const response = await request(app).get('/api/metrics');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('deployments');
        expect(response.body).toHaveProperty('successRate');
    });

    test('GET / should serve the frontend', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});
