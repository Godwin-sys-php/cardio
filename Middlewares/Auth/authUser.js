const jwt = require('jsonwebtoken');
const Users = require('../../Models/Users');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const authUser = async (req, res, next) => {
  console.log("hey");
  
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Users.find({ id: decoded.id });

    if (!user || (user.type !== 'user' && user.type !== 'admin')) {
      return res.status(403).json({ message: 'Accès réservé aux utilisateurs' });
    }

    req.user = user; // Ajout de l'utilisateur aux données de requête
    console.log("hey");
    
    next();
  } catch (error) {
    console.log(error);
    
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authUser;