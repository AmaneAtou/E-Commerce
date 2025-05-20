import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  reviewError: null, // Để quản lý lỗi khi thêm review
};

// Thêm review
export const addReview = createAsyncThunk(
  "review/addReview",
  async (formdata) => {
    const response = await axios.post(
      `http://localhost:5000/api/shop/product-reviews/add`,
      formdata
    );
    return response.data;
  }
);

// Lấy tất cả các review của một sản phẩm
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (productId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/product-reviews/${productId}`
    );
    return response.data;
  }
);

// Xóa review
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/product-reviews/delete/${reviewId}` // Sửa lại URL cho đúng với backend
    );
    return response.data.reviewId;

  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý getReviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })

      // Xử lý addReview
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload.data);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.reviewError = action.error.message;
      })

      // Xử lý deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Cập nhật lại state khi xóa review
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload // Dùng _id để so sánh với reviewId
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.reviewError = action.error.message;
      });
  },
});

export default reviewSlice.reducer;
