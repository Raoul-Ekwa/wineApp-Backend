const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const User = require("./User.js");
const Product = require("./Product.js");

const Cart = sequelize.define("Cart", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Relations
Cart.belongsTo(User, { as: "User", foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(Product, {
  as: "Product",
  foreignKey: "productId",
  onDelete: "CASCADE",
});

// Calculer le totalPrice lors de l'ajout ou mise à jour d'un produit dans le panier
Cart.beforeCreate(async (cart, options) => {
  const product = await Product.findByPk(cart.productId);
  if (product) {
    cart.totalPrice = product.price * cart.quantity;
  }
});

module.exports = Cart;
