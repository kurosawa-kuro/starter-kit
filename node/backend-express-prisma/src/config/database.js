require('dotenv').config();

const getDatabaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'test':
      if (!process.env.TEST_DATABASE_URL) {
        throw new Error('TEST_DATABASE_URL is not set in environment variables');
      }
      return process.env.TEST_DATABASE_URL;
    case 'production':
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set in environment variables');
      }
      return process.env.DATABASE_URL;
    default:
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set in environment variables');
      }
      return process.env.DATABASE_URL;
  }
};

module.exports = {
  getDatabaseUrl
}; 