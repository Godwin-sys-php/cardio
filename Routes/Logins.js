const express = require('express');
const router = express.Router();

const authAdmin = require('../Middlewares/Auth/authAdmin');
const auth = require('../Middlewares/Auth/auth');
const validateLoginCreation = require('../Middlewares/Validators/validatorLogins');
const LoginsController = require('../Controllers/Logins');

router.post('/', authAdmin, validateLoginCreation, LoginsController.createLogin);

router.get('/', authAdmin, LoginsController.getAllLogins);

router.get('/:id', auth, LoginsController.getLoginById);
router.get('/:id/reports', auth, LoginsController.getReports);

router.put('/:id', authAdmin, validateLoginCreation, LoginsController.updateLogin);

router.delete('/:id', authAdmin, LoginsController.deleteLogin);

router.post('/login', LoginsController.loginLogin);

module.exports = router;
