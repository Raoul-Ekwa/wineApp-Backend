const express = require("express");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const router = express.Router();

// Créer un paiement pour une commande
router.post("/:orderId", async (req, res) => {
  try {
    const { paymentMethod, paymentStatus, transactionId } = req.body;
    const order = await Order.findByPk(req.params.orderId);
    if (!order)
      return res.status(404).json({ message: "Commande non trouvée" });

    const payment = await Payment.create({
      orderId: order.id,
      paymentMethod,
      paymentStatus: paymentStatus || "pending",
      transactionId,
      paymentDate: new Date(),
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtenir le paiement d'une commande
router.get("/:orderId", async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { orderId: req.params.orderId },
    });
    if (!payment)
      return res.status(404).json({ message: "Paiement non trouvé" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
