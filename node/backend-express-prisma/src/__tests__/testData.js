/**
 * テストデータ定義
 * 各テストファイルで共通して使用するテストデータを管理
 */

// テストユーザーデータ
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123'
};

// 管理者ユーザーデータ
const adminUser = {
  email: 'admin@example.com',
  name: 'Admin User',
  password: 'admin123'
};

// テストユーザーリスト
const testUsers = [
  {
    email: 'user1@example.com',
    name: 'User One',
    password: 'password123'
  },
  {
    email: 'user2@example.com',
    name: 'User Two',
    password: 'password123'
  }
];

module.exports = {
  testUser,
  adminUser,
  testUsers
}; 