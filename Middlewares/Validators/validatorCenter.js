const { body, validationResult } = require('express-validator');

const validateCenterCreation = [
  body('name').notEmpty().withMessage('Le nom du centre est requis'),
  body('address').optional().isString().withMessage("L'adresse doit être une chaîne de caractères"),
  body('tel1').optional().isString().withMessage('Le téléphone doit être une chaîne de caractères'),
  body('tel2').optional().isString().withMessage('Le deuxième téléphone doit être une chaîne de caractères'),
  body('mail').optional().isEmail().withMessage("L'adresse mail doit être valide"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateCenterCreation;
