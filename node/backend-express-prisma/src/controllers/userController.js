const userService = require('../services/userService');
const { AppError } = require('../middleware/errorHandler');

// ユーザー作成
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// ユーザー一覧取得
const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// ユーザー詳細取得
const getUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new AppError('無効なユーザーIDです', 400);
    }
    const user = await userService.getUserById(id);
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// ユーザー更新
const updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new AppError('無効なユーザーIDです', 400);
    }
    const user = await userService.updateUser(id, req.body);
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// ユーザー削除
const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new AppError('無効なユーザーIDです', 400);
    }
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
}; 