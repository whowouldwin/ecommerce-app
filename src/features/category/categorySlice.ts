import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CategoryPagedQueryResponse } from '@commercetools/platform-sdk';
import { apiClient } from '../../commercetools-environment/apiClient';

interface CategoryState {
  categories: CategoryPagedQueryResponse['results'];
  loading: boolean;
  error: string | null;
  selectedCategoryKey: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  selectedCategoryKey: null,
};

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const res = await apiClient
      .getApiRoot()
      .categories()
      .get({ queryArgs: { limit: 20 } })
      .execute();
    return res.body.results;
  },
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategoryKey: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load categories';
      });
  },
});

export const { setSelectedCategoryKey } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
