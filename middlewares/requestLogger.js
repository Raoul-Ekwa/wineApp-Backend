/**
 * Middleware de journalisation des requêtes (Request Logger).
 * Enregistre les informations sur chaque requête HTTP reçue (méthode, URL, statut, temps de réponse).
 * Facilite le suivi et le débogage des opérations sur l’API.
 */
const requestLogger = (req, res, next) => {
  const { method, url } = req; // Récupérer la méthode HTTP et l'URL de la requête
  const timestamp = new Date().toISOString(); // Récupérer l'heure au format ISO
  console.log(`[${timestamp}] ${method} ${url}`); // Afficher un log dans la console
  next(); // Passe au middleware suivant ou au contrôleur
};

module.exports = requestLogger;
