const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Assurer que le nom de la catégorie est unique
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Relations avec le modèle Product
Category.hasMany(Product, { foreignKey: "categoryId", onDelete: "SET NULL" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Category;
