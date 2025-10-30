const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Cart = require("./Cart");
const Product = require("./Product");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
  },
  {
    tableName: "CartItems",
    timestamps: true,
  }
);

// Relations
CartItem.belongsTo(Cart, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

module.exports = CartItem;
