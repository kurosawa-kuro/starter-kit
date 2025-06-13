/**
 * バリデーションミドルウェア
 */

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'バリデーションエラー',
      errors: errors.array()
    });
  }
  next();
};

module.exports = validate; 