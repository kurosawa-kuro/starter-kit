/**
 * データベース設定
 * SQLite接続管理
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('./config');

class Database {
    constructor() {
        this.db = null;
        this.connected = false;
    }

    /**
     * データベース接続を初期化
     */
    async connect() {
        try {
            // データベースディレクトリを作成
            const dbDir = path.dirname(config.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // SQLiteデータベースに接続
            this.db = new sqlite3.Database(config.dbPath, (err) => {
                if (err) {
                    console.error('SQLite connection error:', err.message);
                    this.connected = false;
                    return;
                }
                this.connected = true;
                console.log(`📦 SQLite database connected: ${config.dbPath}`);
            });

            // テーブル初期化
            await this.initializeTables();
            
            return true;
        } catch (error) {
            console.warn(`⚠️ Database connection failed: ${error.message}`);
            console.warn('🔄 Running in mock mode');
            this.connected = false;
            return false;
        }
    }

    /**
     * テーブル初期化
     */
    async initializeTables() {
        return new Promise((resolve, reject) => {
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS hello_world_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            this.db.run(createTableSQL, (err) => {
                if (err) {
                    console.error('Table creation error:', err.message);
                    reject(err);
                } else {
                    console.log('📋 Database tables initialized');
                    resolve();
                }
            });
        });
    }

    /**
     * データベース接続を終了
     */
    async disconnect() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Database close error:', err.message);
                    } else {
                        console.log('📦 Database disconnected');
                    }
                    this.connected = false;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * クエリ実行
     */
    async query(sql, params = []) {
        if (!this.connected || !this.db) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Database query error:', err);
                    reject(err);
                } else {
                    resolve({ rows, rowCount: rows.length });
                }
            });
        });
    }

    /**
     * 単一行クエリ実行
     */
    async queryOne(sql, params = []) {
        if (!this.connected || !this.db) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('Database query error:', err);
                    reject(err);
                } else {
                    resolve({ row, rowCount: row ? 1 : 0 });
                }
            });
        });
    }

    /**
     * INSERT/UPDATE/DELETE実行
     */
    async run(sql, params = []) {
        if (!this.connected || !this.db) {
            throw new Error('Database not connected');
        }

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('Database run error:', err);
                    reject(err);
                } else {
                    resolve({
                        lastID: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }

    /**
     * 接続状態確認
     */
    isConnected() {
        return this.connected;
    }
}

module.exports = new Database(); 