const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const User = require("./User.js");
const Product = require("./Product.js");

const Review = sequelize.define("Review", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // L'évaluation minimale est de 1 étoile
      max: 5, // L'évaluation maximale est de 5 étoiles
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true, // Le commentaire est facultatif
  },
});

// Relations
Review.belongsTo(User, {
  as: "User",
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Review.belongsTo(Product, {
  as: "Product",
  foreignKey: "productId",
  onDelete: "CASCADE",
});

module.exports = Review;
