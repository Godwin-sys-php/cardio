const { body, validationResult } = require('express-validator');
const Centers = require('../../Models/Centers');

const validateLoginCreation = [
  body('centerId').isInt().withMessage("L'ID du centre doit être un entier"),
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('username').isString().notEmpty().withMessage("Le nom d'utilisateur est requis"),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Vérification de l'existence de centerId en base de données
    try {
      const center = await Centers.find({ id: req.body.centerId });
      if (!center) {
        return res.status(400).json({ message: "Le centre spécifié n'existe pas" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la vérification du centre', error });
    }
  },
];

module.exports = validateLoginCreation;
