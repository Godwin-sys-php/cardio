const jwt = require('jsonwebtoken');
const Users = require('../../Models/Users');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware pour vérifier si l'utilisateur est un admin
const authAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = await Users.find({ id: decoded.id });

    user = user[0];

    if (!user || user.type !== 'admin') {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    req.user = user; // Ajout de l'utilisateur aux données de requête
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authAdmin;