const request = require('supertest');
const app = require('../config/app');
const prisma = require('../config/prisma');
const { testUser } = require('./testData');

describe('User API', () => {
  beforeEach(async () => {
    // テストデータのクリーンアップ
    await prisma.user.deleteMany();
  });

  describe('POST /users', () => {
    it('新しいユーザーを作成できること', async () => {
      const response = await request(app)
        .post('/users')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('重複するメールアドレスでユーザーを作成できないこと', async () => {
      // 最初のユーザーを作成
      await request(app)
        .post('/users')
        .send(testUser);

      // 同じメールアドレスで再度作成を試みる
      const response = await request(app)
        .post('/users')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('必須フィールドが欠けている場合にエラーを返すこと', async () => {
      const invalidUser = {
        email: 'test@example.com'
        // nameが欠けている
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /users', () => {
    it('ユーザー一覧を取得できること', async () => {
      // テストユーザーを作成
      await request(app)
        .post('/users')
        .send(testUser);

      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].email).toBe(testUser.email);
      expect(response.body[0].name).toBe(testUser.name);
      expect(response.body[0]).toHaveProperty('createdAt');
      expect(response.body[0]).toHaveProperty('updatedAt');
    });
  });
}); 