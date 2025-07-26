-- Hello World API データベース初期化スクリプト

-- Hello World メッセージテーブルの作成
CREATE TABLE IF NOT EXISTS hello_world_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_hello_world_messages_created_at ON hello_world_messages(created_at);

-- サンプルデータの挿入
INSERT INTO hello_world_messages (name, message) VALUES 
    ('Default User', 'Hello, World!'),
    ('Admin User', 'Welcome to the API!')
ON CONFLICT DO NOTHING;

-- 更新時刻を自動更新するためのトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの作成
DROP TRIGGER IF EXISTS update_hello_world_messages_updated_at ON hello_world_messages;
CREATE TRIGGER update_hello_world_messages_updated_at
    BEFORE UPDATE ON hello_world_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 