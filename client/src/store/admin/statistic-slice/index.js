
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductStatistics = createAsyncThunk(
  "statistics/fetchProductStatistics",
  async () => {
    const response = await axios.get("http://localhost:5000/api/admin/statistics/products");
    return response.data;
  }
);

const AdminStatisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default AdminStatisticsSlice.reducer;
