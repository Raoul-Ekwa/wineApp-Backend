/**
 * Middleware de validation des données.
 * Vérifie la conformité des données reçues dans les requêtes (body, params, query).
 * Utilise des schémas ou des règles pour garantir l’intégrité des informations avant traitement.
 */
const { body, validationResult } = require("express-validator");

// Validation des données pour l'inscription
const validateRegistration = [
  body("email").isEmail().withMessage("Email invalide"), // Vérifie que l'email est valide
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit avoir au moins 6 caractères"), // Vérifie la longueur du mot de passe
  body("name").notEmpty().withMessage("Le nom est requis"), // Vérifie que le nom est non vide
];

// Middleware pour vérifier les erreurs de validation
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // Si aucune erreur, passe à la fonction suivante (le contrôleur)
};

module.exports = { validateRegistration, checkValidation };
