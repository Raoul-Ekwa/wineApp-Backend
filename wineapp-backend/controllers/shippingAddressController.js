const ShippingAddress = require("../models/ShippingAddress");

const createShippingAddress = async (req, res) => {
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
};

const getShippingAddressByUserId = async (req, res) => {
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
};

module.exports = {
  createShippingAddress,
  getShippingAddressByUserId,
};
