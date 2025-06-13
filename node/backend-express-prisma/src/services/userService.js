const prisma = require('../config/database');

class UserService {
  async createUser(email, name) {
    return await prisma.user.create({
      data: { email, name }
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }
}

module.exports = new UserService(); 