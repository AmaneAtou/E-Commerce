const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const mongoose = require("mongoose");
// Thêm đánh giá sản phẩm
const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Kiểm tra xem người dùng đã mua sản phẩm này chưa
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Tạo mới đánh giá sản phẩm
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    // Cập nhật lại trung bình đánh giá của sản phẩm
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
      message: "Review added successfully!",
    });
  } catch (error) {
    console.error("Error adding product review:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding the review.",
    });
  }
};

// Lấy danh sách đánh giá của sản phẩm
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Tìm các đánh giá của sản phẩm
    const reviews = await ProductReview.find({ productId });
    
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching reviews.",
    });
  }
};

// Xoá đánh giá sản phẩm (thêm chức năng xoá review)


const deleteProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log("Review ID nhận được:", reviewId);

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format",
      });
    }

    // Tìm và xóa đánh giá
    const deletedReview = await ProductReview.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found!",
      });
    }

    // Cập nhật lại điểm đánh giá trung bình
    const productId = deletedReview.productId;
    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;

    const averageReview =
      totalReviewsLength > 0
        ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / totalReviewsLength
        : 0;

    await Product.findByIdAndUpdate(productId, { averageReview });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully!",
    reviewId: reviewId,
  });
  } catch (error) {
    console.error("Error deleting product review:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the review.",
      error: error.message,
    });
  }
};


module.exports = { addProductReview, getProductReviews, deleteProductReview };
