/**
 * Middleware de limitation de débit (Rate Limiting).
 * Limite le nombre de requêtes par utilisateur ou IP sur une période donnée.
 * Protège l’API contre les abus et les attaques par déni de service (DoS).
 */
const rateLimit = require("express-rate-limit");

// Middleware pour limiter les requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limiter à 100 requêtes par IP dans cette fenêtre
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});

// Appliquer ce middleware à toutes les routes
module.exports = limiter;
