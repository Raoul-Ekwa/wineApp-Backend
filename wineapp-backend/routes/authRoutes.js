const express = require("express");
const {
  registerUser,
  loginUser,
  passwordResetRequest,
  resetPassword,
} = require("../controllers/authController.js");

const router = express.Router();

// Route pour l'inscription
router.post("/register", registerUser); // 🔹 doit être une fonction

// Route pour la connexion
router.post("/login", loginUser);

// Route pour demander la réinitialisation du mot de passe
router.post("/password-reset", passwordResetRequest); // 🔹 nouvelle route pour demander la réinitialisation

// Route pour réinitialiser le mot de passe avec le token
router.post("/password-reset/:token", resetPassword); // 🔹 nouvelle route pour réinitialiser le mot de passe

module.exports = router;
