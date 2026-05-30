-- Hello Worldメッセージテーブル作成
CREATE TABLE IF NOT EXISTS hello_world_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_hello_world_messages_created_at ON hello_world_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_hello_world_messages_name ON hello_world_messages(name);

-- サンプルデータ挿入
INSERT INTO hello_world_messages (name, message) VALUES
    ('Alice', 'Hello, Alice!'),
    ('Bob', 'Hello, Bob!'),
    ('Charlie', 'Hello, Charlie!')
ON CONFLICT DO NOTHING; 