const express = require("express");
const ShippingAddress = require("../models/ShippingAddress");

const router = express.Router();

// Ajouter une adresse de livraison
router.post("/", async (req, res) => {
  try {
    const { userId, addressLine1, addressLine2, city, postalCode, country } =
      req.body;
    const address = await ShippingAddress.create({
      userId,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
    });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir l'adresse de livraison d'un utilisateur
router.get("/:userId", async (req, res) => {
  try {
    const address = await ShippingAddress.findOne({
      where: { userId: req.params.userId },
    });
    if (!address)
      return res.status(404).json({ message: "Adresse non trouvée" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
