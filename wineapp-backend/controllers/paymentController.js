const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createPayment = async (req, res) => {
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
};

const getPaymentByOrderId = async (req, res) => {
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
};

module.exports = {
  createPayment,
  getPaymentByOrderId,
};
