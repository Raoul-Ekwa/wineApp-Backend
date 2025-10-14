/**
 * Middleware d'authentification.
 * Vérifie la présence et la validité du token JWT dans la requête.
 * Si le token est valide, ajoute l'utilisateur à req.user et passe à la suite.
 * Sinon, retourne une erreur 401 (non autorisé).
 */
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Récupérer le token de l'en-tête

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérification du token
    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
    next(); // Passe à la fonction suivante (le contrôleur de la route)
  } catch (err) {
    return res.status(400).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = authMiddleware;
