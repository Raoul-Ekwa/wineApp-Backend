require("dotenv").config();
const { sequelize, connectDB } = require("./config/db");
const User = require("./models/User");

async function main() {
  try {
    // Connexion à la base
    await connectDB();

    // Synchronisation des modèles (optionnel)
    await sequelize.sync({ alter: true });
    console.log(" Modèles synchronisés.");

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { email: "jean.dupont@example.com" },
    });
    if (existingUser) {
      console.log(" L’utilisateur existe déjà !");
      return;
    }

    // Créer un utilisateur exemple
    const newUser = await User.create({
      name: "ekwa",
      email: "ekwa@gmail.com",
      telephone: "690856820",
      password: "secret123",
    });

    console.log(" Utilisateur créé :", newUser.toJSON());

    // Fermer la connexion
    await sequelize.close();
    console.log(" Connexion fermée.");
  } catch (err) {
    console.error(" Erreur :", err);
  }
}

main();
