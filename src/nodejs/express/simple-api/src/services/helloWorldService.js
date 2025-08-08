/**
 * Hello World サービス
 * ビジネスロジック層
 */

const database = require('../config/database');
const mockData = require('../utils/mock');
const { ResponseFactory } = require('../models/response');
const { logger, databaseLogger } = require('../middleware/logger');

class HelloWorldService {
    constructor() {
        this.db = database;
        this.mockData = mockData;
    }

    /**
     * Hello Worldメッセージを取得
     */
    async getHelloWorldMessage(name = 'World') {
        const startTime = Date.now();
        
        try {
            // データベース接続確認
            if (!this.db.isConnected()) {
                logger.debug('Using mock data for getHelloWorldMessage', { name });
                return this.mockData.getMockHelloWorldMessage(name);
            }

            // データベースから取得
            const query = `
                SELECT id, name, message, created_at, updated_at 
                FROM hello_world_messages 
                WHERE name = ? 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            const result = await this.db.query(query, [name]);
            const duration = Date.now() - startTime;
            
            databaseLogger(query, [name], duration);

            if (result.rows.length > 0) {
                logger.debug('Hello World message retrieved from database', { name, id: result.rows[0].id });
                return result.rows[0];
            }

            // 新規作成
            logger.debug('Creating new Hello World message', { name });
            return await this.addHelloWorldMessage(name);
        } catch (error) {
            const duration = Date.now() - startTime;
            logger.error('Error in getHelloWorldMessage', { name, error: error.message, duration });
            // エラー時はモックデータを返す
            return this.mockData.getMockHelloWorldMessage(name);
        }
    }

    /**
     * Hello Worldメッセージを追加
     */
    async addHelloWorldMessage(name, customMessage = null) {
        const startTime = Date.now();
        
        try {
            // データベース接続確認
            if (!this.db.isConnected()) {
                            logger.debug('Using mock data for addHelloWorldMessage', { name, customMessage });
            return this.mockData.addMockHelloWorldMessage(name, customMessage);
            }

            // データベースに保存
            const message = customMessage || `Hello, ${name}!`;
            const insertQuery = `
                INSERT INTO hello_world_messages (name, message, created_at, updated_at)
                VALUES (?, ?, datetime('now'), datetime('now'))
            `;
            const result = await this.db.run(insertQuery, [name, message]);
            
            // 挿入されたレコードを取得
            const selectQuery = `
                SELECT id, name, message, created_at, updated_at 
                FROM hello_world_messages 
                WHERE id = ?
            `;
            const insertedRecord = await this.db.queryOne(selectQuery, [result.lastID]);
            const duration = Date.now() - startTime;
            
            databaseLogger(insertQuery, [name, message], duration);

            logger.info('Hello World message created', { 
                id: insertedRecord.row.id, 
                name, 
                message,
                duration 
            });
            
            return insertedRecord.row;
        } catch (error) {
            const duration = Date.now() - startTime;
            logger.error('Error in addHelloWorldMessage', { 
                name, 
                customMessage, 
                error: error.message, 
                duration 
            });
            // エラー時はモックデータを返す
            return this.mockData.addMockHelloWorldMessage(name, customMessage);
        }
    }

    /**
     * Hello Worldメッセージ一覧を取得
     */
    async listHelloWorldMessages() {
        const startTime = Date.now();
        
        try {
            // データベース接続確認
            if (!this.db.isConnected()) {
                            logger.debug('Using mock data for listHelloWorldMessages');
            return this.mockData.getAllMockHelloWorldMessages();
            }

            // データベースから取得
            const query = `
                SELECT id, name, message, created_at, updated_at 
                FROM hello_world_messages 
                ORDER BY created_at DESC
            `;
            const result = await this.db.query(query);
            const duration = Date.now() - startTime;
            
            databaseLogger(query, [], duration);

            logger.debug('All Hello World messages retrieved', { 
                count: result.rows.length, 
                duration 
            });
            
            return result.rows;
        } catch (error) {
            const duration = Date.now() - startTime;
            logger.error('Error in listHelloWorldMessages', { 
                error: error.message, 
                duration 
            });
            // エラー時はモックデータを返す
            return this.mockData.getAllMockHelloWorldMessages();
        }
    }

    /**
     * データベーステーブル初期化
     */
    async initializeDatabase() {
        try {
            if (!this.db.isConnected()) {
                logger.info('Database not connected, skipping table initialization');
                return;
            }

            // テーブル初期化はdatabase.jsで行われるため、ここでは何もしない
            logger.info('Database tables already initialized');
            
        } catch (error) {
            logger.error('Error initializing database table', { error: error.message });
        }
    }
}

module.exports = new HelloWorldService(); 