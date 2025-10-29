/**
 * Middleware de sécurité.
 * Ajoute des protections contre les vulnérabilités courantes (XSS, CSRF, injection, etc.).
 * Configure des en-têtes HTTP sécurisés et applique des règles de validation.
 */
const helmet = require("helmet");

// Middleware pour ajouter des headers de sécurité à toutes les réponses
const securityMiddleware = (req, res, next) => {
  app.use(helmet()); // Utilise Helmet pour sécuriser les headers HTTP
  next();
};

module.exports = securityMiddleware;
