-- Hello World API データベース初期化スクリプト
-- PostgreSQL 15用

-- データベースの作成（既に存在する場合はスキップ）
-- CREATE DATABASE sampledb;

-- ユーザーの作成（既に存在する場合はスキップ）
-- CREATE USER sampleuser WITH PASSWORD 'samplepass';

-- 権限の付与
-- GRANT ALL PRIVILEGES ON DATABASE sampledb TO sampleuser;

-- sampledbデータベースに接続
\c sampledb;

-- Hello Worldメッセージテーブルの作成
CREATE TABLE IF NOT EXISTS hello_world_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_hello_world_messages_name ON hello_world_messages(name);
CREATE INDEX IF NOT EXISTS idx_hello_world_messages_created_at ON hello_world_messages(created_at);

-- サンプルデータの挿入
INSERT INTO hello_world_messages (name, message, created_at, updated_at) VALUES
    ('World', 'Hello, World!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Express', 'Hello, Express!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Node.js', 'Hello, Node.js!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- テーブル情報の表示
\dt hello_world_messages;

-- サンプルデータの確認
SELECT * FROM hello_world_messages; 