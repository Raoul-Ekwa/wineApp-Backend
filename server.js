// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Import de la base de données
const { connectDB, sequelize } = require("./config/db.js");

// Import des routes
const authRoutes = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");

// Chargement des variables d’environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

//  Sécurisation des headers HTTP
app.use(helmet());

//  Autoriser les requêtes Cross-Origin
app.use(cors());

//  Middleware pour parser les requêtes JSON
app.use(express.json());

// 🪵 Logger HTTP (uniquement en développement)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//  Limiteur de requêtes pour éviter les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter à 100 requêtes par IP
  message: { error: "Trop de requêtes, veuillez réessayer plus tard." },
});
app.use("/api", limiter); // Limiter uniquement les endpoints API

//  Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

//  Swagger - Documentation API
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WineApp API",
      version: "1.0.0",
      description: "Documentation de l'API WineApp",
    },
    servers: [{ url: "http://localhost:5000", description: "Serveur local" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//  Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Ressource non trouvée" });
});

//  Gestion globale des erreurs (middleware)
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur",
  });
});

//  Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(` Serveur en cours d'exécution sur http://localhost:${PORT}`);

  try {
    await sequelize.sync({ alter: true }); // alter pour ajuster sans perte de données
    console.log("  Base de données synchronisée avec succès !");
  } catch (err) {
    console.error(" Erreur de synchronisation avec PostgreSQL :", err);
  }
});
