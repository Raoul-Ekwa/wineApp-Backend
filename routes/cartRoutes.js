const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/authMiddleware");

// ➕ Ajouter un produit au panier
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * product.price;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        totalPrice: quantity * product.price,
      });
    }

    // Inclure le produit pour que le front puisse l'afficher
    cartItem = await Cart.findByPk(cartItem.id, {
      include: [
        { model: Product, attributes: ["id", "name", "price", "image"] },
      ],
    });

    res
      .status(201)
      .json({ message: "Produit ajouté au panier ✅", item: cartItem });
  } catch (err) {
    console.error("Erreur ajout panier :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 📦 Récupérer tous les produits du panier
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findAll({
      where: { userId },
      include: [
        { model: Product, attributes: ["id", "name", "price", "image"] },
      ],
    });
    res.json(cart);
  } catch (err) {
    console.error("Erreur récupération panier :", err);
    res.status(500).json({ message: err.message });
  }
});

// 🔄 Mettre à jour la quantité d'un produit
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem)
      return res.status(404).json({ message: "Article non trouvé" });

    const product = await Product.findByPk(cartItem.productId);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * product.price;
    await cartItem.save();

    const updatedCartItem = await Cart.findByPk(cartItem.id, {
      include: [
        { model: Product, attributes: ["id", "name", "price", "image"] },
      ],
    });

    res.json({ message: "Quantité mise à jour ✅", item: updatedCartItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Supprimer un produit du panier
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id);
    if (!cartItem)
      return res.status(404).json({ message: "Article non trouvé" });

    await cartItem.destroy();
    res.status(200).json({ message: "Produit supprimé du panier ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🧹 Vider complètement le panier
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.destroy({ where: { userId } });
    res.json({ message: "Panier vidé avec succès 🧺" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
