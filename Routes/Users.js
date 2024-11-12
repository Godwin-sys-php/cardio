const express = require('express');
const router = express.Router();

const authAdmin = require('../Middlewares/Auth/authAdmin');
const authUser = require('../Middlewares/Auth/authUser');
const validateUserCreation = require('../Middlewares/Validators/validatorUsers');
const UsersController = require('../Controllers/Users');

router.post('/', authAdmin, validateUserCreation, UsersController.createUser);

router.get('/', authUser, UsersController.getAllUsers);

router.get('/:id', authUser, UsersController.getUserById);

router.put('/:id', authAdmin, validateUserCreation, UsersController.updateUser);

router.delete('/:id', authAdmin, UsersController.deleteUser);

router.post('/login', UsersController.loginUser);

module.exports = router;
