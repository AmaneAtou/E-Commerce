import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// LẤY DANH SÁCH ẢNH
export const getFeatureImages = createAsyncThunk(
  "/feature/getFeatureImages",
  async () => {
    const response = await axios.get(`http://localhost:5000/api/common/feature/get`);
    return response.data;
  }
);

// THÊM ẢNH MỚI
export const addFeatureImage = createAsyncThunk(
  "/feature/addFeatureImage",
  async (image) => {
    const response = await axios.post(`http://localhost:5000/api/common/feature/add`, {
      image,
    });
    return response.data;
  }
);

// XOÁ ẢNH
export const deleteFeatureImage = createAsyncThunk(
  "/feature/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(`http://localhost:5000/api/common/feature/delete/${id}`);
    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

      // ADD
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Có thể push trực tiếp để thêm nhanh vào danh sách
        state.featureImageList.push(action.payload.data);
      })
      .addCase(addFeatureImage.rejected, (state) => {
        state.isLoading = false;
      })

      // DELETE
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Cập nhật lại danh sách bằng cách lọc ra ảnh bị xoá
        state.featureImageList = state.featureImageList.filter(
          (img) => img._id !== action.meta.arg
        );
      })
      .addCase(deleteFeatureImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commonSlice.reducer;
