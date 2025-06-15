import { CartDiscount, DiscountCode } from '@commercetools/platform-sdk';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus } from '../../enums/appEnums';
import { apiClient } from '../../commercetools-environment/apiClient';
import type { RootState } from '../../store/store.ts';

export interface DiscountState {
  discountCodes: DiscountCode[];
  cartDiscounts: CartDiscount[];
  status: RequestStatus;
  error: string | null;
}

const initialState: DiscountState = {
  discountCodes: [],
  cartDiscounts: [],
  status: RequestStatus.IDLE,
  error: null,
};

export const fetchDiscountCodes = createAsyncThunk(
  'discount/fetchDiscountCodes',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient
        .getApiRoot()
        .discountCodes()
        .get({ queryArgs: { limit: 100, expand: ['cartDiscounts[*]'] } })
        .execute();
      return response.body.results;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue('Failed to load discount codes');
    }
  },
);

export const fetchCartDiscounts = createAsyncThunk(
  'discount/fetchCartDiscounts',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient
        .getApiRoot()
        .cartDiscounts()
        .get({ queryArgs: { limit: 100 } })
        .execute();
      return response.body.results;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue('Failed to load cart discounts');
    }
  },
);

export const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountCodes.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(
        fetchDiscountCodes.fulfilled,
        (state, action: PayloadAction<DiscountCode[]>) => {
          state.discountCodes = action.payload;
          state.status = RequestStatus.IDLE;
          state.error = null;
        },
      )
      .addCase(fetchDiscountCodes.rejected, (state, action) => {
        state.status = RequestStatus.FAILED;
        state.error = action.payload as string;
      })
      .addCase(fetchCartDiscounts.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(
        fetchCartDiscounts.fulfilled,
        (state, action: PayloadAction<CartDiscount[]>) => {
          state.cartDiscounts = action.payload;
          state.status = RequestStatus.IDLE;
          state.error = null;
        },
      )
      .addCase(fetchCartDiscounts.rejected, (state, action) => {
        state.status = RequestStatus.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const discountReducer = discountSlice.reducer;
export const selectDiscountCodes = (state: RootState) =>
  state.discount.discountCodes;
