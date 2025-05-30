import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductProjection } from '@commercetools/platform-sdk';
import { getProducts } from '../../services';
import { RootState } from '../../store/store';

interface ProductState {
  products: ProductProjection[];
  loading: boolean;
  error: string | null;
  isFiltering: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  isFiltering: false,
};

export interface FetchProductsParams {
  sort?: string;
  limit?: number;
  offset?: number;
  searchText?: string;
}

export const fetchProducts = createAsyncThunk<
  ProductProjection[],
  FetchProductsParams | void,
  { state: RootState }
>('product/fetchProducts', async (params = {}, { getState }) => {
  const state = getState();
  const { brand, color, size, priceRange, categories, materials } =
    state.filters;

  const filterParams = {
    brands: brand.length > 0 ? brand : undefined,
    colors: color.length > 0 ? color : undefined,
    sizes: size.length > 0 ? size : undefined,
    priceRange: priceRange || undefined,
    categories: categories.length > 0 ? categories : undefined,
    materials: materials.length > 0 ? materials : undefined,
    searchText: params?.searchText,
    language: 'en',
  };

  const res = await getProducts(
    filterParams,
    params?.sort,
    params?.limit,
    params?.offset,
  );

  if (res.body && Array.isArray(res.body.results)) {
    return res.body.results;
  } else if (res.body && Array.isArray(res.body)) {
    return res.body;
  } else {
    console.error('Unexpected response structure:', res);
    return [];
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load products';
      });
  },
});

export const productReducer = productSlice.reducer;
