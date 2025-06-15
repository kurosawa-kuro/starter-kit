const request = require('supertest');
const app = require('../config/app');
const { testUser, adminUser, testUsers } = require('./testData');
const prisma = require('../config/prisma');

describe('User API Tests', () => {
  // テストデータのセットアップ
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
    });

    it('should not create user with existing email', async () => {
      // 最初のユーザーを作成
      await request(app)
        .post('/api/users')
        .send(testUser);

      // 同じメールアドレスで再度作成を試みる
      const response = await request(app)
        .post('/api/users')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should validate user input', async () => {
      const invalidUser = {
        email: 'invalid-email',
        name: 'a'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      // テストユーザーを作成
      for (const user of testUsers) {
        await request(app)
          .post('/api/users')
          .send(user);
      }
    });

    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.results).toBe(testUsers.length);
      expect(response.body.data.users).toHaveLength(testUsers.length);
    });
  });

  describe('GET /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      // テストユーザーを作成
      const response = await request(app)
        .post('/api/users')
        .send(testUser);
      userId = response.body.data.user.id;
    });

    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.id).toBe(userId);
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/999999');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('PUT /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      // テストユーザーを作成
      const response = await request(app)
        .post('/api/users')
        .send(testUser);
      userId = response.body.data.user.id;
    });

    it('should update user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.email).toBe(updateData.email);
    });

    it('should not update with invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        name: 'a'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/users/:id', () => {
    let userId;

    beforeEach(async () => {
      // テストユーザーを作成
      const response = await request(app)
        .post('/api/users')
        .send(testUser);
      userId = response.body.data.user.id;
    });

    it('should delete user', async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`);

      expect(response.status).toBe(204);

      // ユーザーが実際に削除されたことを確認
      const deletedUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/999999');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });
}); 