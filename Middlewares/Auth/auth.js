const jwt = require('jsonwebtoken');
const Logins = require('../../Models/Logins');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const login = await Logins.find({ id: decoded.id });

    if (!login) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    req.login = login[0]; // Ajout des informations de connexion aux données de requête
    next();
  } catch (error) {
    console.log(error);
    
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = auth;