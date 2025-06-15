const { body, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// ユーザー作成・更新時のバリデーション
const validateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('名前は必須です')
    .isLength({ min: 2, max: 50 })
    .withMessage('名前は2文字以上50文字以下で入力してください'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join(', '), 400));
    }
    next();
  }
];

// ユーザー更新時のバリデーション
const validateUserUpdate = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail(),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('名前は2文字以上50文字以下で入力してください'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join(', '), 400));
    }
    next();
  }
];

module.exports = {
  validateUser,
  validateUserUpdate
}; 