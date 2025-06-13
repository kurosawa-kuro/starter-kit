const { execSync } = require('child_process');
const prisma = require('../config/prisma');

// テスト環境の設定
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

// テストデータベースのマイグレーションを実行
beforeAll(async () => {
  try {
    // テストデータベースのマイグレーションを実行
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (error) {
    console.error('マイグレーションの実行に失敗しました:', error);
    throw error;
  }
});

// テストデータベースのセットアップ
beforeAll(async () => {
  try {
    // テストデータベースの接続を確認
    await prisma.$connect();
  } catch (error) {
    console.error('データベース接続に失敗しました:', error);
    throw error;
  }
});

// 各テスト後にデータベースをクリーンアップ
afterEach(async () => {
  try {
    const tables = ['User'];
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
  } catch (error) {
    console.error('データベースのクリーンアップに失敗しました:', error);
    throw error;
  }
});

// テスト終了後にデータベース接続を切断
afterAll(async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('データベース接続の切断に失敗しました:', error);
    throw error;
  }
}); 