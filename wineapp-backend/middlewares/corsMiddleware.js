/**
 * Middleware CORS (Cross-Origin Resource Sharing).
 * Permet ou restreint les requêtes HTTP provenant de domaines externes.
 * Configure les en-têtes de réponse pour autoriser l’accès à l’API depuis le frontend ou d’autres clients.
 */
const cors = require("cors");

// Middleware pour autoriser les requêtes provenant de n'importe quel domaine
const corsMiddleware = (req, res, next) => {
  app.use(cors()); // Permet les requêtes de toutes les origines
  next(); // Passe au middleware suivant ou au contrôleur
};

module.exports = corsMiddleware;
