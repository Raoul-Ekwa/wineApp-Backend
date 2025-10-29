const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const User = require("./User.js");
const Product = require("./Product.js");

const Order = sequelize.define("Order", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1, // Validation pour s'assurer que la quantité est au moins 1
    },
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0, // Le prix total ne doit pas être négatif
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending", // Valeur par défaut: "pending"
    validate: {
      isIn: [["pending", "shipped", "delivered", "canceled"]], // Statuts autorisés
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Enregistre la date de création
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Enregistre la date de dernière mise à jour
  },
});

// Calculer le totalPrice automatiquement lors de la création de la commande
Order.beforeCreate(async (order, options) => {
  const product = await Product.findByPk(order.productId);
  if (product) {
    order.totalPrice = product.price * order.quantity; // Calculer le prix total
  }
});

// Relations avec les modèles User et Product
Order.belongsTo(User, {
  as: "User",
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Order.belongsTo(Product, {
  as: "Product",
  foreignKey: "productId",
  onDelete: "CASCADE",
});

module.exports = Order;
