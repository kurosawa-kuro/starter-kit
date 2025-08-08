/**
 * Hello World API テスト
 * SQLite対応の包括的なテストスイート
 */

const request = require('supertest');

// テスト用設定を読み込み
const {
    TEST_DB_PATH,
    initializeTestDatabase,
    cleanupTestDatabase,
    insertTestData
} = require('./test-setup');



// アプリケーションを読み込み
const app = require('../src/app');

describe('Hello World API - SQLite Tests', () => {
    beforeAll(async () => {
        try {
            await initializeTestDatabase();
            const database = require('../src/config/database');
            await database.connect();
        } catch (error) {
            console.error('❌ Failed to initialize test database:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            const database = require('../src/config/database');
            await database.disconnect();
            await cleanupTestDatabase();
        } catch (error) {
            console.error('❌ Failed to cleanup test database:', error);
        }
    });

    beforeEach(async () => {
        try {
            await initializeTestDatabase();
            const database = require('../src/config/database');
            await database.connect();
        } catch (error) {
            console.error('❌ Failed to initialize test database:', error);
        }
    });

    describe('GET /api/hello-world', () => {
        it('should return hello message with default name', async () => {
            const response = await request(app)
                .get('/api/hello-world')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Hello World message retrieved');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('name', 'World');
            expect(response.body.data).toHaveProperty('message', 'Hello, World!');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('created_at');
            expect(response.body.data).toHaveProperty('updated_at');
        });

        it('should return hello message with custom name', async () => {
            const customName = 'TestUser';
            const response = await request(app)
                .get(`/api/hello-world?name=${customName}`)
                .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Hello World message retrieved');
            expect(response.body.data).toHaveProperty('name', customName);
            expect(response.body.data).toHaveProperty('message', `Hello, ${customName}!`);
        });

        it('should create new message when name does not exist', async () => {
            const uniqueName = 'UniqueUser' + Date.now();
            const response = await request(app)
                .get(`/api/hello-world?name=${uniqueName}`)
                .expect(200);

            expect(response.body.data).toHaveProperty('name', uniqueName);
            expect(response.body.data).toHaveProperty('message', `Hello, ${uniqueName}!`);
        });
    });

    describe('POST /api/hello-world', () => {
        it('should create hello message with name only', async () => {
            const data = { name: 'TestUser' };
            
            const response = await request(app)
                .post('/api/hello-world')
                .send(data)
                .expect(201);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Hello World message added');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('name', 'TestUser');
            expect(response.body.data).toHaveProperty('message', 'Hello, TestUser!');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('created_at');
            expect(response.body.data).toHaveProperty('updated_at');
        });

        it('should create hello message with custom message', async () => {
            const data = { 
                name: 'CustomUser', 
                message: 'Welcome to our API!' 
            };
            
            const response = await request(app)
                .post('/api/hello-world')
                .send(data)
                .expect(201);

            expect(response.body.data).toHaveProperty('name', 'CustomUser');
            expect(response.body.data).toHaveProperty('message', 'Welcome to our API!');
        });

        it('should validate required name field', async () => {
            const data = { message: 'This should fail' };
            
            const response = await request(app)
                .post('/api/hello-world')
                .send(data)
                .expect(400);

            expect(response.body).toHaveProperty('status', 'error');
        });

        it('should handle empty name field', async () => {
            const data = { name: '' };
            
            const response = await request(app)
                .post('/api/hello-world')
                .send(data)
                .expect(400);

            expect(response.body).toHaveProperty('status', 'error');
        });
    });

    describe('GET /api/hello-world/list', () => {
        it('should return empty array when no messages exist', async () => {
            const response = await request(app)
                .get('/api/hello-world/list')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Hello World messages retrieved');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(0);
        });

        it('should return all messages from database', async () => {
            // テストデータを挿入
            const testData = [
                { name: 'User1', message: 'Hello, User1!' },
                { name: 'User2', message: 'Hello, User2!' },
                { name: 'User3', message: 'Hello, User3!' }
            ];
            await insertTestData(testData);

            const response = await request(app)
                .get('/api/hello-world/list')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(3);

            // データの順序を確認（最新順）
            expect(response.body.data[0]).toHaveProperty('name', 'User1');
            expect(response.body.data[1]).toHaveProperty('name', 'User2');
            expect(response.body.data[2]).toHaveProperty('name', 'User3');
        });

        it('should return correct message structure', async () => {
            // テストデータを挿入
            await insertTestData([{ name: 'TestUser', message: 'Test message' }]);

            const response = await request(app)
                .get('/api/hello-world/list')
                .expect(200);

            const message = response.body.data[0];
            expect(message).toHaveProperty('id');
            expect(message).toHaveProperty('name', 'TestUser');
            expect(message).toHaveProperty('message', 'Test message');
            expect(message).toHaveProperty('created_at');
            expect(message).toHaveProperty('updated_at');
        });
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Health check successful');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('status', 'OK');
            expect(response.body.data).toHaveProperty('message', 'Server is running');
            expect(response.body.data).toHaveProperty('timestamp');
            expect(response.body.data).toHaveProperty('uptime');
            expect(response.body.data).toHaveProperty('memory');
            expect(response.body.data).toHaveProperty('environment');
            expect(response.body.data).toHaveProperty('database');
        });

        it('should return database connection status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body.data.database).toHaveProperty('connected');
            expect(response.body.data.database).toHaveProperty('mode');
        });

        it('should return memory usage information', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            const memory = response.body.data.memory;
            expect(memory).toHaveProperty('rss');
            expect(memory).toHaveProperty('heapTotal');
            expect(memory).toHaveProperty('heapUsed');
            expect(memory).toHaveProperty('external');
        });
    });

    describe('Database Integration Tests', () => {
        it('should persist data across requests', async () => {
            // 最初のリクエストでメッセージを作成
            const createResponse = await request(app)
                .post('/api/hello-world')
                .send({ name: 'PersistentUser' })
                .expect(201);

            const messageId = createResponse.body.data.id;

            // 2番目のリクエストで同じメッセージを取得
            const getResponse = await request(app)
                .get('/api/hello-world?name=PersistentUser')
                .expect(200);

            expect(getResponse.body.data.id).toBe(messageId);
            expect(getResponse.body.data.name).toBe('PersistentUser');
        });

        it('should handle concurrent requests', async () => {
            const concurrentRequests = 5;
            const promises = [];

            for (let i = 0; i < concurrentRequests; i++) {
                promises.push(
                    request(app)
                        .post('/api/hello-world')
                        .send({ name: `ConcurrentUser${i}` })
                        .expect(201)
                );
            }

            const responses = await Promise.all(promises);
            
            // すべてのリクエストが成功したことを確認
            responses.forEach(response => {
                expect(response.body).toHaveProperty('status', 'success');
                expect(response.body.data).toHaveProperty('id');
            });

            // リストエンドポイントで全データを確認
            const listResponse = await request(app)
                .get('/api/hello-world/list')
                .expect(200);

            expect(listResponse.body.data).toHaveLength(concurrentRequests);
        });
    });

    describe('Error Handling Tests', () => {
        it('should handle invalid JSON in POST request', async () => {
            const response = await request(app)
                .post('/api/hello-world')
                .set('Content-Type', 'application/json')
                .send('invalid json')
                .expect(400);

            expect(response.body).toHaveProperty('status', 'error');
        });

        it('should handle missing Content-Type header', async () => {
            const response = await request(app)
                .post('/api/hello-world')
                .send({ name: 'TestUser' })
                .expect(201); // ExpressはContent-Typeを自動推測するため、201が返る

            expect(response.body).toHaveProperty('status', 'success');
        });

        it('should return 404 for non-existent endpoints', async () => {
            const response = await request(app)
                .get('/api/non-existent')
                .expect(404);

            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Route /api/non-existent not found');
        });
    });
}); 