/**
 * Swagger文書設定
 * API文書自動生成
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World API',
            version: '1.0.0',
            description: 'JavaScript + Express スタータープロジェクト - クリーンアーキテクチャ実装',
            contact: {
                name: 'Development Team',
                email: 'dev@example.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                BaseResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        message: {
                            type: 'string',
                            example: 'Operation completed successfully'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T00:00:00.000Z'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data (optional)'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        error: {
                            type: 'string',
                            example: 'validation_error'
                        },
                        message: {
                            type: 'string',
                            example: 'Validation failed'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T00:00:00.000Z'
                        }
                    }
                },
                HelloWorldMessage: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'World'
                        },
                        message: {
                            type: 'string',
                            example: 'Hello, World!'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T00:00:00.000Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T00:00:00.000Z'
                        }
                    }
                },
                HealthInfo: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'OK'
                        },
                        message: {
                            type: 'string',
                            example: 'Server is running'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-01T00:00:00.000Z'
                        },
                        uptime: {
                            type: 'number',
                            example: 123.456
                        },
                        memory: {
                            type: 'object',
                            properties: {
                                rss: { type: 'number' },
                                heapTotal: { type: 'number' },
                                heapUsed: { type: 'number' },
                                external: { type: 'number' }
                            }
                        },
                        database: {
                            type: 'object',
                            properties: {
                                connected: { type: 'boolean' },
                                mode: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/controllers/*.js', './src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 