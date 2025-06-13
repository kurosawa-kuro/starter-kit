const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Prisma API',
      version: '1.0.0',
      description: 'Express API with Prisma and PostgreSQL',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // ルートファイルのパス
};

const specs = swaggerJsdoc(options);

module.exports = specs; 