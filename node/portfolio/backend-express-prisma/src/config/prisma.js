const { PrismaClient } = require('@prisma/client');
const { getDatabaseUrl } = require('./database');

// Prismaクライアントのインスタンスを作成
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
});

module.exports = prisma; 