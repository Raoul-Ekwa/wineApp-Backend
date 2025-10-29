const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet"); // Sécurisation des headers HTTP
const { connectDB, sequelize } = require("./config/db.js");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const rateLimit = require("express-rate-limit"); // Pour limiter les requêtes
const morgan = require("morgan"); // Pour les logs HTTP détaillés

// Routes
const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middleware pour sécuriser les headers HTTP
app.use(helmet());

// Middleware pour gérer le CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Middleware de logging des requêtes HTTP en développement
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Utiliser 'dev' pour un log détaillé en développement
}

// Middleware de rate limiting pour éviter les attaques par force brute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter à 100 requêtes par IP pendant la fenêtre de 15 minutes
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
app.use(limiter); // Appliquer le rate limiter globalement

// Routes pour l'API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Swagger configuration pour la documentation de l'API
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "WineApp API",
      version: "1.0.0",
      description: "API pour l'application WineApp",
    },
  },
  apis: ["./routes/*.js"], // Ciblez vos fichiers de routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack); // Logge l'erreur pour le debugging
  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur",
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
  try {
    await await sequelize.sync(); // Créer ou ajuster les tables si nécessaire
    console.log("✅ Tables PostgreSQL synchronisées");
  } catch (err) {
    console.error("❌ Erreur lors de la synchronisation des tables :", err);
  }
});
