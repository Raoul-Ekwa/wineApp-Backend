const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ajouter un produit au panier
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // L'ID de l'utilisateur est accessible via le middleware d'authentification

    const cart = await Cart.create({
      userId,
      productId,
      quantity,
      totalPrice: quantity * (await Product.findByPk(productId)).price,
    });
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lister les produits dans le panier de l'utilisateur
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findAll({ where: { userId }, include: "Product" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour la quantité d'un produit dans le panier
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem)
      return res.status(404).json({ message: "Article non trouvé" });

    cartItem.quantity = req.body.quantity;
    cartItem.totalPrice =
      cartItem.quantity * (await Product.findByPk(cartItem.productId)).price;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Supprimer un produit du panier
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem)
      return res.status(404).json({ message: "Article non trouvé" });

    await cartItem.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
