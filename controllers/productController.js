const Product = require("../models/Product.js");

//  Récupérer tous les produits
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Ajouter un produit
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Nom et prix sont obligatoires" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Récupérer un produit par ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Mettre à jour un produit
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    const { name, description, price, image, stock } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.stock = stock || product.stock;

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    await product.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
