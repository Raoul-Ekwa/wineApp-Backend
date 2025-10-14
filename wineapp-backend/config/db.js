// config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Créer une instance Sequelize pour PostgreSQL
const sequelize = new Sequelize(
  process.env.PG_DB,       // Nom de la base
  process.env.PG_USER,     // Utilisateur
  process.env.PG_PASSWORD, // Mot de passe
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    dialect: "postgres",
    logging: false,         // true si tu veux voir toutes les requêtes SQL
  }
);

// Fonction pour connecter la base
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connecté !");
  } catch (error) {
    console.error("❌ Impossible de se connecter à PostgreSQL :", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

