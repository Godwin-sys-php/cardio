const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');
const moment = require('moment')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Création d'un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, username, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username,
      password: hashedPassword,
      type,
      timstamp: moment().unix(),
    };
    const result = await Users.insertOne(newUser);
    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.find({ id });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, type } = req.body;
    const updatedUser = { name, username, type };

    if (password) {
      updatedUser.password = await bcrypt.hash(password, 10);
    }

    const result = await Users.update(updatedUser, { id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Users.delete({ id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
  }
};

// Connexion d'un utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await Users.find({ username });
    if (user.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    user = user[0]

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, type: user.type },
      JWT_SECRET,
      { expiresIn: '100h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token, userData: user, success: true, });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
};
