import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import type {
  Cart,
  LineItem,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';

import { apiClient } from '../../commercetools-environment/apiClient.ts';
import { AuthFlowType, RequestStatus } from '../../enums/appEnums.ts';
import type { RootState } from '../../store/store.ts';

const EMPTY: readonly LineItem[] = [];

interface CartState {
  cart: Cart | null;
  totalItems: number;
  status: RequestStatus;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  totalItems: 0,
  status: RequestStatus.IDLE,
  error: null,
};

export const initCart = createAsyncThunk<
  Cart,
  void,
  { state: RootState; rejectValue: string }
>('cart/init', async (_, { getState, rejectWithValue }) => {
  try {
    const { isAuthenticated } = getState().user;
    if (!isAuthenticated) {
      const { body } = await apiClient
        .getApiRoot()
        .me()
        .carts()
        .get()
        .execute();
      if (body.results.length) {
        return body.results[body.results.length - 1];
      }
      return rejectWithValue('no active carts for anonymous user');
    }
    const { body } = await apiClient
      .getApiRoot()
      .me()
      .activeCart()
      .get()
      .execute();
    return body;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return rejectWithValue(message);
  }
});

export const migrateCartOnLogin = createAsyncThunk<
  Cart,
  void,
  { state: RootState; rejectValue: string }
>('cart/migrate', async (_, { getState, rejectWithValue }) => {
  const { cart } = getState().cart;
  if (!cart || cart.customerId) return rejectWithValue('Nothing to migrate');
  try {
    const { body } = await apiClient
      .getApiRoot()
      .me()
      .carts()
      .replicate()
      .post({ body: { reference: { typeId: 'cart', id: cart.id } } })
      .execute();

    return body as Cart;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return rejectWithValue(message);
  }
});

const cartUpdate = async (cart: Cart, actions: MyCartUpdateAction[]) =>
  (
    await apiClient
      .getApiRoot()
      .me()
      .carts()
      .withId({ ID: cart.id })
      .post({ body: { version: cart.version, actions } })
      .execute()
  ).body as Cart;

export const addLineItem = createAsyncThunk<
  Cart,
  { productId: string; variantId: number; quantity?: number },
  { state: RootState; rejectValue: string }
>(
  'cart/addLineItem',
  async (
    { productId, variantId, quantity = 1 },
    { getState, rejectWithValue },
  ) => {
    const { cart } = getState().cart;
    if (!cart) {
      const { isAuthenticated } = getState().user;
      if (!isAuthenticated) {
        apiClient.changeApiRoot(AuthFlowType.ANONYMOUS_FLOW);
      }
      try {
        const { body } = await apiClient
          .getApiRoot()
          .me()
          .carts()
          .post({
            body: {
              currency: 'EUR',
              lineItems: [{ productId, variantId, quantity }],
            },
          })
          .execute();
        return body;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        return rejectWithValue(message);
      }
    }
    try {
      return await cartUpdate(cart, [
        { action: 'addLineItem', productId, variantId, quantity },
      ]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return rejectWithValue(message);
    }
  },
);

export const applyDiscountCode = createAsyncThunk<
  Cart,
  string,
  { state: RootState; rejectValue: string }
>('cart/applyDiscountCode', async (code, { getState, rejectWithValue }) => {
  const { cart } = getState().cart;
  if (!cart) return rejectWithValue('Cart not initialised');

  try {
    return await cartUpdate(cart, [
      {
        action: 'addDiscountCode',
        code,
      },
    ]);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Failed to apply discount code';
    return rejectWithValue(message || 'Failed to apply discount code');
  }
});

export const removeDiscountCode = createAsyncThunk<
  Cart,
  string,
  { state: RootState; rejectValue: string }
>('cart/applyDiscountCode', async (codeID, { getState, rejectWithValue }) => {
  const { cart } = getState().cart;
  if (!cart) return rejectWithValue('Cart not initialised');
  if (!cart.discountCodes?.length)
    return rejectWithValue('No discount code to remove');

  try {
    return await cartUpdate(cart, [
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: codeID,
        },
      },
    ]);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Failed to apply discount code';
    return rejectWithValue(message || 'Failed to apply discount code');
  }
});

export const changeLineItemQuantity = createAsyncThunk<
  Cart,
  { lineItemId: string; quantity: number },
  { state: RootState; rejectValue: string }
>(
  'cart/changeQty',
  async ({ lineItemId, quantity }, { getState, rejectWithValue }) => {
    const { cart } = getState().cart;
    if (!cart) return rejectWithValue('Cart not initialised');
    try {
      return await cartUpdate(cart, [
        { action: 'changeLineItemQuantity', lineItemId, quantity },
      ]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return rejectWithValue(message);
    }
  },
);

export const removeLineItem = createAsyncThunk<
  Cart,
  { lineItemId: string },
  { state: RootState; rejectValue: string }
>(
  'cart/removeLineItem',
  async ({ lineItemId }, { getState, rejectWithValue }) => {
    const { cart } = getState().cart;
    if (!cart) return rejectWithValue('Cart not initialised');
    try {
      return await cartUpdate(cart, [{ action: 'removeLineItem', lineItemId }]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return rejectWithValue(message);
    }
  },
);

export const selectIsCartUpdating = (state: RootState) =>
  state.cart.status === RequestStatus.LOADING;

export const clearCart = createAsyncThunk<
  Cart,
  void,
  { state: RootState; rejectValue: string }
>('cart/clearCart', async (_, { getState, rejectWithValue }) => {
  const { cart } = getState().cart;
  if (!cart) return rejectWithValue('Cart not initialised');
  if (!cart.lineItems.length) return rejectWithValue('Cart already empty');

  const actions: MyCartUpdateAction[] = cart.lineItems.map((item) => ({
    action: 'removeLineItem' as const,
    lineItemId: item.id,
  }));

  try {
    return await cartUpdate(cart, actions);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    const pending = (state: CartState) => {
      state.status = RequestStatus.LOADING;
      state.error = null;
    };
    const fulfilled = (state: CartState, action: PayloadAction<Cart>) => {
      state.status = RequestStatus.IDLE;
      state.cart = action.payload;
      state.totalItems = action.payload.lineItems.reduce(
        (s, li) => s + li.quantity,
        0,
      );
    };
    const rejected = (
      state: CartState,
      action: PayloadAction<string | undefined>,
    ) => {
      state.status = RequestStatus.FAILED;
      state.error = action.payload ?? 'Unknown error';
    };

    builder

      .addCase(initCart.pending, pending)
      .addCase(initCart.fulfilled, fulfilled)
      .addCase(initCart.rejected, rejected)

      .addCase(migrateCartOnLogin.pending, pending)
      .addCase(migrateCartOnLogin.fulfilled, fulfilled)
      .addCase(migrateCartOnLogin.rejected, rejected)

      .addCase(addLineItem.pending, pending)
      .addCase(addLineItem.fulfilled, fulfilled)
      .addCase(addLineItem.rejected, rejected)

      .addCase(changeLineItemQuantity.pending, pending)
      .addCase(changeLineItemQuantity.fulfilled, fulfilled)
      .addCase(changeLineItemQuantity.rejected, rejected)

      .addCase(removeLineItem.pending, pending)
      .addCase(removeLineItem.fulfilled, fulfilled)
      .addCase(removeLineItem.rejected, rejected)

      .addCase(clearCart.pending, pending)
      .addCase(clearCart.fulfilled, fulfilled)
      .addCase(clearCart.rejected, rejected)

      .addCase(applyDiscountCode.pending, pending)
      .addCase(applyDiscountCode.fulfilled, fulfilled)
      .addCase(applyDiscountCode.rejected, rejected);
  },
});

export const { resetCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartLineItems = createSelector(
  (state: RootState) => state.cart.cart?.lineItems,
  (items) => items ?? EMPTY,
);
export const selectCartPromoCodes = (state: RootState) =>
  state.cart.cart?.discountCodes;
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.cart?.totalPrice;
export const selectCartDiscountOnTotalPrice = (state: RootState) =>
  state.cart.cart?.discountOnTotalPrice;
export const selectCartItemCount = (state: RootState) => state.cart.totalItems;
