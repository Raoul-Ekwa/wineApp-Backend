const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const Order = require("./Order.js");

const Payment = sequelize.define("Payment", {
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["credit_card", "paypal", "bank_transfer"]], // Types de paiement autorisés
    },
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending", // Par défaut en attente
    validate: {
      isIn: [["pending", "completed", "failed"]],
    },
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Relation avec le modèle Order
Payment.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });

module.exports = Payment;
