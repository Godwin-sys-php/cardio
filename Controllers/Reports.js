const Reports = require('../Models/Reports');
const Parents = require('../Models/Parents');

// Création d'un nouveau rapport
exports.createReport = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      birthday,
      weight,
      height,
      others,
      clinic_result,
      path_symptoms,
      path_exams,
      path_traitements,
      path_rep_date,
      loginId,
      centerId,
      father,
      mother
    } = req.body;

    const newReport = {
      firstName,
      lastName,
      gender,
      birthday,
      weight,
      height,
      others,
      clinic_result,
      path_symptoms,
      path_exams,
      path_traitements,
      path_rep_date,
      loginId,
      centerId
    };

    const result = await Reports.insertOne(newReport);
    const reportId = result.insertId;

    // Ajout des informations du père et de la mère (si existantes)
    if (father) await Parents.insertOne({ ...father, type: 'pere', report_id: reportId });
    if (mother) await Parents.insertOne({ ...mother, type: 'mere', report_id: reportId });

    res.status(201).json({ message: 'Rapport créé avec succès', reportId });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Erreur lors de la création du rapport', error });
  }
};

// Récupérer tous les rapports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Reports.findAll();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rapports', error });
  }
};

// Récupérer un rapport par ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Reports.find({ id });
    if (report.length === 0) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    const parents = await Parents.find({ report_id: id, });
    res.status(200).json({ find: true, report: report[0], parents });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du rapport', error });
  }
};

// Mettre à jour un rapport
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      gender,
      birthday,
      weight,
      height,
      others,
      clinic_result,
      path_symptoms,
      path_exams,
      path_traitements,
      path_rep_date,
      loginId,
      centerId,
      father,
      mother
    } = req.body;

    const updatedReport = {
      firstName,
      lastName,
      gender,
      birthday,
      weight,
      height,
      others,
      clinic_result,
      path_symptoms,
      path_exams,
      path_traitements,
      path_rep_date,
      loginId,
      centerId
    };

    const result = await Reports.update(updatedReport, { id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    // Mise à jour des informations des parents (père et mère)
    if (father) await Reports.updateParent({ ...father, type: 'pere' }, { report_id: id });
    if (mother) await Reports.updateParent({ ...mother, type: 'mere' }, { report_id: id });

    res.status(200).json({ message: 'Rapport mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rapport', error });
  }
};

// Supprimer un rapport
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reports.delete({ id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rapport non trouvé' });
    }

    // Suppression des parents associés
    await Reports.deleteParentsByReportId(id);
    res.status(200).json({ message: 'Rapport et parents associés supprimés avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du rapport', error });
  }
};
