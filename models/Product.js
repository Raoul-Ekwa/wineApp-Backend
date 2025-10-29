const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      // Pour tester, on retire la validation isUrl.
      // Si tu as des URLs, tu peux la remettre.
      // validate: {
      //   isUrl: true,
      // },
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0,
      },
    },
  },
  {
    tableName: "products", // Force le nom de la table exact
    freezeTableName: true, // Empêche Sequelize de pluraliser automatiquement
    timestamps: true, // Gère createdAt et updatedAt automatiquement
  }
);

// Hook avant création : éviter stock négatif
Product.beforeCreate(async (product, options) => {
  if (product.stock < 0) {
    product.stock = 0;
  }
});

module.exports = Product;
