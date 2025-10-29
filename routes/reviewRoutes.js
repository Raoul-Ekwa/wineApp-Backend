const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// Ajouter un avis
router.post("/", async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    const review = await Review.create({ userId, productId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lister les avis d'un produit
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lister les avis d'un utilisateur
router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.params.userId },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
