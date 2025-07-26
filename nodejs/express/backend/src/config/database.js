/**
 * データベース設定
 * PostgreSQL接続管理
 */

const { Pool } = require('pg');
const config = require('./config');

class Database {
    constructor() {
        this.pool = null;
        this.connected = false;
    }

    /**
     * データベース接続を初期化
     */
    async connect() {
        try {
            this.pool = new Pool({
                host: config.dbHost,
                port: config.dbPort,
                user: config.dbUser,
                password: config.dbPass,
                database: config.dbName,
                max: 25, // 最大接続数
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
                ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
            });

            // 接続テスト
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();
            
            this.connected = true;
            console.log(`📦 Database connected to ${config.dbHost}:${config.dbPort}/${config.dbName}`);
            
            return true;
        } catch (error) {
            console.warn(`⚠️ Database connection failed: ${error.message}`);
            console.warn('🔄 Running in mock mode');
            this.connected = false;
            return false;
        }
    }

    /**
     * データベース接続を終了
     */
    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.connected = false;
            console.log('📦 Database disconnected');
        }
    }

    /**
     * クエリ実行
     */
    async query(text, params) {
        if (!this.connected || !this.pool) {
            throw new Error('Database not connected');
        }
        
        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    /**
     * 接続状態確認
     */
    isConnected() {
        return this.connected;
    }
}

module.exports = new Database(); 