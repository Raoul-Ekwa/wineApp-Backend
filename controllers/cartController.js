// src/controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// 🛒 Ajouter un produit au panier
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Vérifier la présence du produit
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "❌ Produit non trouvé." });
    }

    // Vérifier si ce produit existe déjà dans le panier
    let existingItem = await Cart.findOne({
      where: { userId, productId },
    });

    if (existingItem) {
      // Mise à jour de la quantité et du prix total
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * product.price;
      await existingItem.save();

      return res.status(200).json({
        message: " Quantité mise à jour dans le panier.",
        item: existingItem,
      });
    }

    // Sinon, créer un nouvel article
    const newItem = await Cart.create({
      userId,
      productId,
      quantity,
      totalPrice: quantity * product.price,
    });

    res.status(201).json({
      message: "🛒 Produit ajouté au panier avec succès.",
      item: newItem,
    });
  } catch (err) {
    console.error("Erreur dans addToCart:", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};

//  Récupérer tous les articles du panier de l’utilisateur
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["id", "name", "price", "image"], // Limite les données renvoyées
        },
      ],
    });

    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Erreur dans getCartItems:", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};

//  Mettre à jour la quantité d’un article dans le panier
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) {
      return res
        .status(404)
        .json({ message: " Article non trouvé dans votre panier." });
    }

    const product = await Product.findByPk(cartItem.productId);
    if (!product) {
      return res.status(404).json({ message: " Produit non trouvé." });
    }

    // Mise à jour
    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * product.price;
    await cartItem.save();

    res.status(200).json({
      message: " Panier mis à jour avec succès.",
      item: cartItem,
    });
  } catch (err) {
    console.error("Erreur dans updateCartItem:", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};

//  Supprimer un article du panier
const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) {
      return res
        .status(404)
        .json({ message: " Article non trouvé dans votre panier." });
    }

    await cartItem.destroy();
    res.status(200).json({ message: " Article supprimé du panier." });
  } catch (err) {
    console.error("Erreur dans removeCartItem:", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};

//  Optionnel : Vider tout le panier d’un utilisateur
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.destroy({ where: { userId } });
    res.status(200).json({ message: "🧹 Panier vidé avec succès." });
  } catch (err) {
    console.error("Erreur dans clearCart:", err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
};
