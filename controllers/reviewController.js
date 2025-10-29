const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    const review = await Review.create({ userId, productId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewsByUserId = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.params.userId },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addReview,
  getReviewsByProductId,
  getReviewsByUserId,
};
