const { body, validationResult } = require('express-validator');

const validateUserCreation = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('username').isString().notEmpty().withMessage('Le nom d’utilisateur est requis'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('type').isIn(['admin', 'normal']).withMessage("Le type d'utilisateur doit être 'admin' ou 'normal'"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUserCreation;
