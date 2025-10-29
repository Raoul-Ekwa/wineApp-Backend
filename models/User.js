const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db.js");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // peut être null si l'utilisateur se connecte uniquement via téléphone
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: false, // obligatoire maintenant
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[0-9+\-\s()]*$/i, // validation simple du format téléphone
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255],
    },
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Hachage du mot de passe avant création ou mise à jour
User.beforeCreate(async (user, options) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Vérifie si le token de réinitialisation est encore valide
User.prototype.isPasswordResetTokenValid = function () {
  return this.passwordResetExpires && this.passwordResetExpires > Date.now();
};

// Vérifie si le mot de passe est correct
User.prototype.isPasswordValid = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
