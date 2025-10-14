const express = require("express");
const { getProducts, createProduct } = require("../controllers/productController.js");

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct); // ✅ route pour ajouter un produit

module.exports = router;
