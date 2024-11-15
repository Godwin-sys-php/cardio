const { body, validationResult } = require('express-validator');

const validateCenterCreation = [
  body('name').notEmpty().withMessage('Le nom du centre est requis'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateCenterCreation;
