const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middleware/validators');

router.post('/', validateUser, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:email', userController.getUserByEmail);

module.exports = router; 