/**
 * シンプルなロガーミドルウェア
 */

const logger = {
  info: (message) => {
    console.log(message);
  },
  error: (message) => {
    console.error(message);
  },
  warn: (message) => {
    console.warn(message);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'dev') {
      console.debug(message);
    }
  }
};

module.exports = logger; 