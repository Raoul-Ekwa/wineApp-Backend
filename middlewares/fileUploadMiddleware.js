/**
 * Middleware CORS (Cross-Origin Resource Sharing).
 * Permet ou restreint les requêtes HTTP provenant de domaines externes.
 * Configure les en-têtes de réponse pour autoriser l’accès à l’API depuis le frontend ou d’autres clients.
 */
const multer = require("multer");

// Définir où et comment les fichiers seront stockés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Dossier de destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nom du fichier
  },
});

const upload = multer({ storage });

// Middleware pour accepter un seul fichier
const uploadSingle = upload.single("image"); // 'image' est le nom du champ dans le formulaire

module.exports = uploadSingle;
