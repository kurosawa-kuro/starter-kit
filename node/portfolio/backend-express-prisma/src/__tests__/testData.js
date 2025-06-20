/**
 * テストデータ定義
 * 各テストファイルで共通して使用するテストデータを管理
 */

// テストユーザーデータ
const testUser = {
  email: 'test@example.com',
  name: 'Test User'
};

// 管理者ユーザーデータ
const adminUser = {
  email: 'admin@example.com',
  name: 'Admin User'
};

// テストユーザーリスト
const testUsers = [
  {
    email: 'user1@example.com',
    name: 'User One'
  },
  {
    email: 'user2@example.com',
    name: 'User Two'
  }
];

module.exports = {
  testUser,
  adminUser,
  testUsers
}; 