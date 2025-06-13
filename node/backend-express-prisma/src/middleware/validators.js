const { body } = require('express-validator');

const validateUser = [
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('name').notEmpty().withMessage('名前は必須です')
];

module.exports = {
  validateUser
}; 