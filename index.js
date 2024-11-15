const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Middlewares globaux
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(
  "/assets",
  express.static(path.join(__dirname, "dist", "assets"))
);

// Import des routes
const usersRoutes = require('./Routes/Users');
const loginsRoutes = require('./Routes/Logins');
const centersRoutes = require('./Routes/Centers');
const reportsRoutes = require('./Routes/Reports');

// Définition des routes
app.use('/api/users', usersRoutes);
app.use('/api/logins', loginsRoutes);
app.use('/api/centers', centersRoutes);
app.use('/api/reports', reportsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Lancement du serveur
const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
