/**
 * Middleware de gestion des erreurs.
 * Capture les erreurs survenues dans les routes ou les contrôleurs.
 * Retourne une réponse JSON avec le message d'erreur et le code HTTP approprié.
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(err); // Affiche l'erreur dans la console pour le debugging

  // Si l'erreur a un statut spécifique, on l'utilise, sinon 500 pour une erreur interne
  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur",
    stack: err.stack || "Aucune trace d'erreur disponible", // Optionnel, utile pour le développement
  });
};

module.exports = errorMiddleware;
