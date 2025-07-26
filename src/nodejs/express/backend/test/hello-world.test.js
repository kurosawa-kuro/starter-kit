const request = require('supertest');
const app = require('../src/app');

describe('Hello World API', () => {
    describe('GET /api/hello-world', () => {
        it('should return hello message', async () => {
            const response = await request(app)
                .get('/api/hello-world')
                .expect(200);

            expect(response.body.message).toBeDefined();
            expect(response.body.timestamp).toBeDefined();
        });
    });

    describe('POST /api/hello-world', () => {
        it('should create hello message', async () => {
            const data = { name: 'TestUser' };
            
            const response = await request(app)
                .post('/api/hello-world')
                .send(data)
                .expect(201);

            expect(response.body.message).toBeDefined();
        });
    });

    describe('GET /api/hello-world/list', () => {
        it('should return all messages from database', async () => {
            const response = await request(app)
                .get('/api/hello-world/list')
                .expect(200);

            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body.status).toBe('success');
        });
    });
}); 