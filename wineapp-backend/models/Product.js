const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Validation pour s'assurer que le nom n'est pas vide
      len: [1, 255], // Validation pour s'assurer que le nom est entre 1 et 255 caractères
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // La description est optionnelle
    validate: {
      len: [0, 1000], // Limiter la longueur de la description à 1000 caractères
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true, // Vérifie que le prix est un nombre flottant
      min: 0, // Le prix ne peut pas être négatif
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Image est optionnelle
    validate: {
      isUrl: true, // Vérifie que l'image est une URL valide
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: true, // Vérifie que le stock est un entier
      min: 0, // Le stock ne peut pas être négatif
    },
  },
});

// Exemple de hook Sequelize (avant la création ou mise à jour du produit)
Product.beforeCreate(async (product, options) => {
  // Vous pouvez ajouter des logiques avant la création, par exemple :
  if (product.stock < 0) {
    product.stock = 0; // Assurer que le stock ne peut pas être négatif
  }
});

module.exports = Product;
