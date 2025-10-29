const express = require("express");
const {
  registerUser,
  loginUser,
  passwordResetRequest,
  resetPassword,
} = require("../controllers/authController.js");

const router = express.Router();

// 🔹 Route pour l'inscription
router.post("/register", registerUser);

// 🔹 Route pour la connexion
router.post("/login", loginUser);

// 🔹 Route pour demander la réinitialisation du mot de passe
router.post("/password-reset", passwordResetRequest);

// 🔹 Route pour réinitialiser le mot de passe avec le token dans l'URL
router.post("/password-reset/:token", resetPassword);

module.exports = router;
