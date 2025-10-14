const express = require("express");
const Discount = require("../models/Discount");

const router = express.Router();

// Créer une réduction
router.post("/", async (req, res) => {
  try {
    const { code, percentage, validFrom, validTo } = req.body;
    const discount = await Discount.create({
      code,
      percentage,
      validFrom,
      validTo,
    });
    res.status(201).json(discount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lister toutes les réductions
router.get("/", async (req, res) => {
  try {
    const discounts = await Discount.findAll();
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Appliquer un code promo
router.post("/apply", async (req, res) => {
  const { code } = req.body;
  try {
    const discount = await Discount.findOne({ where: { code } });
    if (!discount)
      return res.status(404).json({ message: "Code promo invalide" });

    // Vérifier si la réduction est valide
    if (new Date() > discount.validTo) {
      return res.status(400).json({ message: "Le code promo a expiré" });
    }

    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
