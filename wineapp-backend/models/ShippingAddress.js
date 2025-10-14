const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const User = require("./User.js");

const ShippingAddress = sequelize.define("ShippingAddress", {
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relation avec l'utilisateur
ShippingAddress.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = ShippingAddress;
