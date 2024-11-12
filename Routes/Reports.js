const express = require('express');
const router = express.Router();

const authUser = require('../Middlewares/Auth/authUser');
const validateReportCreation = require('../Middlewares/Validators/validatorReport');
const ReportsController = require('../Controllers/Reports');
const auth = require('../Middlewares/Auth/auth');

router.post('/', auth, validateReportCreation, ReportsController.createReport);

router.get('/', authUser, ReportsController.getAllReports);

router.get('/:id', auth, ReportsController.getReportById);

router.put('/:id', authUser, validateReportCreation, ReportsController.updateReport);

router.delete('/:id', authUser, ReportsController.deleteReport);

module.exports = router;
