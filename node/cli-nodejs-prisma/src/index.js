#!/usr/bin/env node

const { Command } = require('commander');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const program = new Command();

program
  .name('user-cli')
  .description('CLI application for managing users')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new user')
  .requiredOption('-e, --email <email>', 'User email')
  .requiredOption('-n, --name <name>', 'User name')
  .action(async (options) => {
    try {
      const user = await prisma.user.create({
        data: {
          email: options.email,
          name: options.name,
        },
      });
      console.log('Created user:', user);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  });

program
  .command('list')
  .description('List all users')
  .action(async () => {
    try {
      const users = await prisma.user.findMany();
      console.log('Users:', users);
    } catch (error) {
      console.error('Error listing users:', error);
    }
  });

program
  .command('get')
  .description('Get a user by email')
  .requiredOption('-e, --email <email>', 'User email')
  .action(async (options) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: options.email,
        },
      });
      console.log('User:', user);
    } catch (error) {
      console.error('Error getting user:', error);
    }
  });

program.parse(); 