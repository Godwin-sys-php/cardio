const Logins = require("../../Models/Logins");
const Centers = require("../../Models/Centers");

module.exports = async (req, res, next) => {
  try {
    req.body.loginId = req.login.id;
    req.body.centerId = req.login.centerId;
    // Vérifier si le login existe
    const login = await Logins.find({ id: req.body.loginId });
    if (login.length === 0) {
      return res
        .status(400)
        .json({ message: "L'identifiant de connexion (loginId) n'existe pas" });
    }

    // Vérifier si le centre existe
    const center = await Centers.find({ id: req.body.centerId });
    if (center.length === 0) {
      return res
        .status(400)
        .json({ message: "L'identifiant du centre (centerId) n'existe pas" });
    }

    // Vérifier si le login est associé au centerId
    if (login[0].centerId !== req.body.centerId) {
      console.log("hey");
      
      return res
        .status(400)
        .json({ message: "Le médecin n'est pas associé au centre spécifié" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Erreur lors de la vérification des identifiants",
        error,
      });
  }
};
