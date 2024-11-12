const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Logins = require('../Models/Logins');
const moment = require("moment");
const Centers = require('../Models/Centers');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Création d'une nouvelle connexion (médecin)
exports.createLogin = async (req, res) => {
  try {
    const { name, username, password, centerId, tel, mail } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newLogin = {
      name,
      username,
      password: hashedPassword,
      centerId,
      tel,
      mail,
      timestamp: moment().unix(),
    };
    const result = await Logins.insertOne(newLogin);
    res.status(201).json({ message: 'Connexion créée avec succès', loginId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la connexion', error });
  }
};

// Récupérer toutes les connexions
exports.getAllLogins = async (req, res) => {
  try {
    const logins = await Logins.customQuery("SELECT logins.*, centers.name AS centerName FROM logins JOIN centers ON logins.centerId = centers.id", []);
    res.status(200).json({ success: true, data: logins, });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des connexions', error });
  }
};

// Récupérer une connexion par ID
exports.getLoginById = async (req, res) => {
  try {
    const { id } = req.params;
    const login = await Logins.find({ id });
    if (login.lenght === 0) {
      return res.status(404).json({ message: 'Connexion non trouvée' });
    }
    const center = await Centers.find({ id: login[0].centerId });
    res.status(200).json({ find: true, login: login[0], center: center[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la connexion', error });
  }
};

// Mettre à jour une connexion
exports.updateLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, centerId, tel, mail } = req.body;
    const updatedLogin = { name, username, centerId, tel, mail };

    if (password) {
      updatedLogin.password = await bcrypt.hash(password, 10);
    }

    const result = await Logins.update(updatedLogin, { id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Connexion non trouvée' });
    }
    res.status(200).json({ message: 'Connexion mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la connexion', error });
  }
};

// Supprimer une connexion
exports.deleteLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Logins.delete({ id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Connexion non trouvée' });
    }
    res.status(200).json({ message: 'Connexion supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la connexion', error });
  }
};

exports.getReports = async (req, res) => {
  try {
    const {id} = req.params;

    const reports = await Logins.customQuery("SELECT * FROM reports WHERE loginId = ?", [id]);

    return res.status(200).json({ find: true, reports });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
}

// Connexion d'un médecin
exports.loginLogin = async (req, res) => {
  try {
    console.log(req.body);
    
    let { username, password } = req.body;
    username = username.trim().toLowerCase();
    const login = await Logins.find({ username });
    if (login.length === 0) {
      return res.status(404).json({ message: 'Medecin non trouvée' });
    }

    const isPasswordValid = await bcrypt.compare(password, login[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: login[0].id, centerId: login[0].centerId },
      JWT_SECRET,
      { expiresIn: '100h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token, id: login[0].id });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
};
