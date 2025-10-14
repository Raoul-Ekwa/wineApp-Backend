const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Discount = sequelize.define("Discount", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // La réduction ne peut pas être inférieure à 1%
      max: 100, // La réduction ne peut pas dépasser 100%
    },
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validTo: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Discount;
