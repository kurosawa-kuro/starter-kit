const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

class UserService {
  async createUser(userData) {
    const { email, name } = userData;

    // メールアドレスの重複チェック
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new AppError('このメールアドレスは既に登録されています', 400);
    }

    return await prisma.user.create({
      data: {
        email,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async getUserById(id) {
    if (!Number.isInteger(id)) {
      throw new AppError('無効なユーザーIDです', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError('ユーザーが見つかりません', 404);
    }

    return user;
  }

  async updateUser(id, userData) {
    if (!Number.isInteger(id)) {
      throw new AppError('無効なユーザーIDです', 400);
    }

    const { name, email } = userData;

    // ユーザーの存在確認
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new AppError('ユーザーが見つかりません', 404);
    }

    // メールアドレスの重複チェック（変更がある場合）
    if (email && email !== existingUser.email) {
      const userWithEmail = await this.getUserByEmail(email);
      if (userWithEmail) {
        throw new AppError('このメールアドレスは既に使用されています', 400);
      }
    }

    return await prisma.user.update({
      where: { id },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async deleteUser(id) {
    if (!Number.isInteger(id)) {
      throw new AppError('無効なユーザーIDです', 400);
    }

    // ユーザーの存在確認
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new AppError('ユーザーが見つかりません', 404);
    }

    await prisma.user.delete({
      where: { id }
    });
  }
}

module.exports = new UserService(); 