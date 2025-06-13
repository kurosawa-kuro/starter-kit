const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email')
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください'),
  body('name')
    .notEmpty()
    .withMessage('名前は必須です'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateUser
}; 