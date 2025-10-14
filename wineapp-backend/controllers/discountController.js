const Discount = require("../models/Discount");

const createDiscount = async (req, res) => {
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
};

const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll();
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const applyDiscount = async (req, res) => {
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
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  applyDiscount,
};
