const { Client } = require('pg');

// Neon database connection URL (Direct connection - for testing only)
const NEON_DB_URL = 'postgresql://neondb_owner:Nrp3FfO1goiB@ep-noisy-cherry-a7rp6riz-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testDirectConnection() {
  const client = new Client({
    connectionString: NEON_DB_URL,
  });

  try {
    console.log('🔌 Neonデータベースに直接接続中...');
    
    // Connect to the database
    await client.connect();
    console.log('✅ 接続成功！');
    
    // Test a simple query
    console.log('📊 データベース情報を取得中...');
    const result = await client.query('SELECT version()');
    console.log('📋 PostgreSQL バージョン:', result.rows[0].version);
    
    // Test current timestamp
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('🕐 現在時刻:', timeResult.rows[0].current_time);
    
    // Test database name
    const dbResult = await client.query('SELECT current_database() as db_name');
    console.log('🗄️  データベース名:', dbResult.rows[0].db_name);
    
    console.log('🎉 直接接続テストが成功しました！');
    
  } catch (error) {
    console.error('❌ 接続エラー:', error.message);
    console.error('詳細:', error);
  } finally {
    // Always close the connection
    await client.end();
    console.log('🔌 接続を閉じました');
  }
}

// Run the connection test
testDirectConnection(); 