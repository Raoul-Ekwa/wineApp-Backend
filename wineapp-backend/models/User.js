const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db.js");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Validation pour s'assurer que le nom n'est pas vide
      len: [1, 255], // Validation pour limiter la longueur du nom entre 1 et 255 caractères
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Assurer que l'email est unique
    validate: {
      isEmail: true, // Valider que l'email a un format valide
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255], // S'assurer que le mot de passe a entre 6 et 255 caractères
    },
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true, // Le token de réinitialisation peut être nul
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true, // La date d'expiration du token peut être nulle
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Valeur par défaut pour la date de création
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Valeur par défaut pour la date de mise à jour
  },
});

// Hook pour hacher le mot de passe avant de créer ou de mettre à jour un utilisateur
User.beforeCreate(async (user, options) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10); // Hachage du mot de passe avec bcrypt
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10); // Hachage du mot de passe avec bcrypt
  }
});

// Méthode d'instance pour vérifier si le token de réinitialisation est valide
User.prototype.isPasswordResetTokenValid = function () {
  // Compare la date d'expiration du token avec la date actuelle
  return this.passwordResetExpires > Date.now();
};

// Méthode d'instance pour comparer le mot de passe avec un mot de passe donné
User.prototype.isPasswordValid = async function (password) {
  return bcrypt.compare(password, this.password); // Vérifie si le mot de passe est correct
};

module.exports = User;
