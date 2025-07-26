/**
 * モックデータ管理
 * データベース接続なしでの動作用
 */

class MockData {
    constructor() {
        this.helloWorldMessages = [
            {
                id: 1,
                name: 'World',
                message: 'Hello, World!',
                created_at: new Date('2025-01-01T00:00:00.000Z').toISOString(),
                updated_at: new Date('2025-01-01T00:00:00.000Z').toISOString()
            },
            {
                id: 2,
                name: 'Express',
                message: 'Hello, Express!',
                created_at: new Date('2025-01-02T00:00:00.000Z').toISOString(),
                updated_at: new Date('2025-01-02T00:00:00.000Z').toISOString()
            },
            {
                id: 3,
                name: 'Node.js',
                message: 'Hello, Node.js!',
                created_at: new Date('2025-01-03T00:00:00.000Z').toISOString(),
                updated_at: new Date('2025-01-03T00:00:00.000Z').toISOString()
            }
        ];
        this.nextId = 4;
    }

    /**
     * Hello Worldメッセージを取得
     */
    getMockHelloWorldMessage(name) {
        // 既存のメッセージを検索
        const existingMessage = this.helloWorldMessages.find(msg => msg.name === name);
        if (existingMessage) {
            return existingMessage;
        }

        // 新規メッセージを作成
        return {
            id: this.nextId++,
            name: name || 'World',
            message: `Hello, ${name || 'World'}!`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    /**
     * 全Hello Worldメッセージを取得
     */
    getAllMockHelloWorldMessages() {
        return [...this.helloWorldMessages];
    }

    /**
     * Hello Worldメッセージを追加
     */
    addMockHelloWorldMessage(name, customMessage = null) {
        const message = customMessage || `Hello, ${name}!`;
        const newMessage = {
            id: this.nextId++,
            name: name,
            message: message,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        this.helloWorldMessages.push(newMessage);
        return newMessage;
    }

    /**
     * アプリケーション情報を取得
     */
    getMockAppInfo() {
        return {
            name: 'Hello World API',
            version: '1.0.0',
            description: 'JavaScript + Express スタータープロジェクト - クリーンアーキテクチャ実装',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
            features: {
                rateLimit: true,
                helmet: true,
                swagger: true,
                mockMode: true,
                validation: true,
                logging: true
            },
            endpoints: {
                health: '/api/health',
                helloWorld: '/api/hello-world',
                documentation: '/api-docs'
            }
        };
    }

    /**
     * ヘルスチェック情報を取得
     */
    getMockHealthInfo() {
        return {
            status: 'OK',
            message: 'Server is running in mock mode',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                rss: process.memoryUsage().rss,
                heapTotal: process.memoryUsage().heapTotal,
                heapUsed: process.memoryUsage().heapUsed,
                external: process.memoryUsage().external
            },
            database: {
                connected: false,
                mode: 'mock',
                message: 'Using mock data'
            },
            services: {
                helloWorld: 'OK',
                rateLimit: 'OK',
                logging: 'OK'
            }
        };
    }

    /**
     * モックデータをリセット
     */
    resetMockData() {
        this.helloWorldMessages = [
            {
                id: 1,
                name: 'World',
                message: 'Hello, World!',
                created_at: new Date('2025-01-01T00:00:00.000Z').toISOString(),
                updated_at: new Date('2025-01-01T00:00:00.000Z').toISOString()
            },
            {
                id: 2,
                name: 'Express',
                message: 'Hello, Express!',
                created_at: new Date('2025-01-02T00:00:00.000Z').toISOString(),
                updated_at: new Date('2025-01-02T00:00:00.000Z').toISOString()
            },
            {
                id: 3,
                name: 'Node.js',
                message: 'Hello, Node.js!',
                created_at: new Date('2025-01-03T00:00:00.000Z').toISOString(),
                updated_at: new Date('2025-01-03T00:00:00.000Z').toISOString()
            }
        ];
        this.nextId = 4;
    }

    /**
     * モックデータ統計を取得
     */
    getMockStats() {
        return {
            totalMessages: this.helloWorldMessages.length,
            nextId: this.nextId,
            lastUpdated: this.helloWorldMessages.length > 0 
                ? Math.max(...this.helloWorldMessages.map(msg => new Date(msg.updated_at).getTime()))
                : null
        };
    }
}

module.exports = new MockData(); 