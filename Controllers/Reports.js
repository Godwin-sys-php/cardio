const Reports = require("../Models/Reports");
const Parents = require("../Models/Parents");

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
      mother,
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
      centerId,
    };

    const result = await Reports.insertOne(newReport);
    const reportId = result.insertId;

    // Ajout des informations du père et de la mère (si existantes)
    if (father)
      await Parents.insertOne({ ...father, type: "pere", report_id: reportId });
    if (mother)
      await Parents.insertOne({ ...mother, type: "mere", report_id: reportId });

    res.status(201).json({ message: "Rapport créé avec succès", reportId });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Erreur lors de la création du rapport", error });
  }
};

// Récupérer tous les rapports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Reports.customQuery(
      `
      SELECT 
    r.id AS report_id,
    r.firstName AS report_firstName,
    r.lastName AS report_lastName,
    r.gender AS report_gender,
    r.birthday AS report_birthday,
    r.weight AS report_weight,
    r.height AS report_height,
    r.others AS report_others,
    r.clinic_result AS report_clinic_result,
    r.path_symptoms AS report_path_symptoms,
    r.path_exams AS report_path_exams,
    r.path_traitements AS report_path_traitements,
    r.path_rep_date AS report_path_rep_date,
    r.timestamp AS report_timestamp,

    -- Informations sur le login ayant créé le rapport
    l.name AS login_name,
    l.mail AS login_mail,

    -- Informations sur le centre
    c.name AS center_name,
    c.address AS center_address,

    -- Informations sur le parent de type "pere"
    p_pere.id AS pere_id,
    p_pere.firstName AS pere_firstName,
    p_pere.lastName AS pere_lastName,
    p_pere.tel AS pere_tel,
    p_pere.mail AS pere_mail,
    p_pere.address AS pere_address,
    p_pere.birthday AS pere_birthday,
    p_pere.path_clinic AS pere_path_clinic,
    p_pere.is_path_tob AS pere_is_path_tob,
    p_pere.is_path_alc AS pere_is_path_alc,
    p_pere.path_others AS pere_path_others,

    -- Informations sur le parent de type "mere"
    p_mere.id AS mere_id,
    p_mere.firstName AS mere_firstName,
    p_mere.lastName AS mere_lastName,
    p_mere.tel AS mere_tel,
    p_mere.mail AS mere_mail,
    p_mere.address AS mere_address,
    p_mere.birthday AS mere_birthday,
    p_mere.path_clinic AS mere_path_clinic,
    p_mere.is_path_tob AS mere_is_path_tob,
    p_mere.is_path_alc AS mere_is_path_alc,
    p_mere.path_others AS mere_path_others

FROM 
    reports AS r
-- Jointure pour récupérer le login ayant créé le rapport
LEFT JOIN 
    logins AS l ON r.loginId = l.id
-- Jointure pour récupérer le centre
LEFT JOIN 
    centers AS c ON r.centerId = c.id
-- Jointures pour les parents
LEFT JOIN 
    parents AS p_pere ON r.id = p_pere.report_id AND p_pere.type = 'pere'
LEFT JOIN 
    parents AS p_mere ON r.id = p_mere.report_id AND p_mere.type = 'mere';
`,
      []
    );
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des rapports", error });
  }
};

// Récupérer un rapport par ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Reports.find({ id });
    if (report.length === 0) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    const parents = await Parents.find({ report_id: id });
    res.status(200).json({ find: true, report: report[0], parents });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du rapport", error });
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
      mother,
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
      centerId,
    };

    const result = await Reports.update(updatedReport, { id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Mise à jour des informations des parents (père et mère)
    if (father)
      await Reports.updateParent(
        { ...father, type: "pere" },
        { report_id: id }
      );
    if (mother)
      await Reports.updateParent(
        { ...mother, type: "mere" },
        { report_id: id }
      );

    res.status(200).json({ message: "Rapport mis à jour avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du rapport", error });
  }
};

// Supprimer un rapport
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reports.delete({ id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Suppression des parents associés
    await Reports.deleteParentsByReportId(id);
    res
      .status(200)
      .json({ message: "Rapport et parents associés supprimés avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du rapport", error });
  }
};
