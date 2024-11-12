const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Middlewares globaux
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Import des routes
const usersRoutes = require('./Routes/Users');
const loginsRoutes = require('./Routes/Logins');
const centersRoutes = require('./Routes/Centers');
const reportsRoutes = require('./Routes/Reports');

// Définition des routes
app.use('/users', usersRoutes);
app.use('/logins', loginsRoutes);
app.use('/centers', centersRoutes);
app.use('/reports', reportsRoutes);

// Gestion des erreurs 404 pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Lancement du serveur
const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
