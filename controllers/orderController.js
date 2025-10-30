const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");

//  Créer une commande
const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // L'ID de l'utilisateur est accessible via le middleware d'authentification

    // Vérifier si le produit existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Vérifier stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuffisant" });
    }

    // Calcul du prix total
    const totalPrice = product.price * quantity;

    // Créer la commande
    const order = await Order.create({
      userId,
      productId,
      quantity,
      totalPrice,
    });

    // Mise à jour du stock produit
    product.stock -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Récupérer toutes les commandes
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: "User" },
        { model: Product, as: "Product" },
      ],
    });
    res.json(orders);
  } catch (err) {
    console.error(" Erreur getOrders:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Récupérer une commande spécifique
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: "User" },
        { model: Product, as: "Product" },
      ],
    });

    if (!order)
      return res.status(404).json({ message: "Commande non trouvée" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { createOrder, getOrders, getOrderById };
