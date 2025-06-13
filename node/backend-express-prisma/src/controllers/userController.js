const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  async createUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, name } = req.body;
      const user = await userService.createUser(email, name);
      res.status(201).json(user);
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
      } else {
        next(error);
      }
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req, res, next) {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController(); 