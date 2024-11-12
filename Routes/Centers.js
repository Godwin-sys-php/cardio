const express = require('express');
const router = express.Router();

const authAdmin = require('../Middlewares/Auth/authAdmin');
const validateCenterCreation = require('../Middlewares/Validators/validatorCenter');
const CentersController = require('../Controllers/Centers');

router.post('/', authAdmin, validateCenterCreation, CentersController.createCenter);

router.get('/', authAdmin, CentersController.getAllCenters);

router.get('/:id', authAdmin, CentersController.getCenterById);

router.put('/:id', authAdmin, validateCenterCreation, CentersController.updateCenter);

router.delete('/:id', authAdmin, CentersController.deleteCenter);

module.exports = router;
