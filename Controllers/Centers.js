const Centers = require('../Models/Centers');
const moment = require('moment')

// Création d'un nouveau centre
exports.createCenter = async (req, res) => {
  try {
    const { name, address, tel1, tel2, mail } = req.body;
    const newCenter = {
      name,
      address,
      tel1,
      tel2,
      mail,
      timstamp: moment().unix(),
    };
    const result = await Centers.insertOne(newCenter);
    res.status(201).json({ message: 'Centre créé avec succès', centerId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du centre', error });
  }
};

// Récupérer tous les centres
exports.getAllCenters = async (req, res) => {
  try {
    const centers = await Centers.findAll();
    res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des centres', error });
  }
};

// Récupérer un centre par ID
exports.getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Centers.find({ id });
    if (!center) {
      return res.status(404).json({ message: 'Centre non trouvé' });
    }
    res.status(200).json(center);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du centre', error });
  }
};

// Mettre à jour un centre
exports.updateCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, tel1, tel2, mail } = req.body;
    const updatedCenter = { name, address, tel1, tel2, mail };

    const result = await Centers.update(updatedCenter, { id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Centre non trouvé' });
    }
    res.status(200).json({ message: 'Centre mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du centre', error });
  }
};

// Supprimer un centre
exports.deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Centers.delete({ id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Centre non trouvé' });
    }
    res.status(200).json({ message: 'Centre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du centre', error });
  }
};
