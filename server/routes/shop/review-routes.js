const express = require("express");

const {
  addProductReview,
  getProductReviews,
  deleteProductReview,  // Import thêm controller xóa review
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);
router.delete("/delete/:reviewId", deleteProductReview);

module.exports = router;
