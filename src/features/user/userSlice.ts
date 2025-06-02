import {
  Address,
  Customer,
  MyCustomerUpdateAction,
  MyCustomerSetDefaultBillingAddressAction,
  MyCustomerSetDefaultShippingAddressAction,
} from '@commercetools/platform-sdk';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store.ts';
import { login, logout, retryAuthWithRefresh } from '../../services';
import { IUserAuthData } from '../../types';
import { RequestStatus } from '../../enums/appEnums.ts';
import { mapCustomerToUserState } from './userMappers.ts';
import { apiClient } from '../../commercetools-environment/apiClient';
import { AddressInput } from '../../types/types.ts';
export interface UserState {
  isAuthenticated: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  addresses: Address[];
  defaultBillingAddressId: string | null;
  defaultShippingAddressId: string | null;
  version: number | null;
  status: RequestStatus;
}

async function getUserDataFromLastSession() {
  const response = await retryAuthWithRefresh();
  if (response && response.statusCode === 200) {
    return response.body;
  }
}

const getUserData = await getUserDataFromLastSession();

let parsedUserState;
if (getUserData) {
  parsedUserState = {
    isAuthenticated: true,
    email: getUserData.email || null,
    firstName: getUserData.firstName || null,
    lastName: getUserData.lastName || null,
    dateOfBirth: getUserData.dateOfBirth || null,
    addresses: getUserData.addresses,
    defaultBillingAddressId: getUserData.defaultBillingAddressId || null,
    defaultShippingAddressId: getUserData.defaultShippingAddressId || null,
    version: getUserData.version || null,
    status: RequestStatus.IDLE,
  };
}

const initialState: UserState = parsedUserState || {
  isAuthenticated: false,
  email: null,
  firstName: null,
  lastName: null,
  dateOfBirth: null,
  addresses: [],
  defaultBillingAddressId: null,
  defaultShippingAddressId: null,
  version: null,
  status: RequestStatus.IDLE,
};

export const fetchUserFromLastSession = createAsyncThunk(
  'user/fetchUserFromLastSession',
  async (_, thunkAPI) => {
    try {
      const response = await retryAuthWithRefresh();
      if (response && response.statusCode === 200) {
        return response.body;
      }
      return thunkAPI.rejectWithValue('No session');
    } catch (e) {
      console.error(e);
      return thunkAPI.rejectWithValue('Failed to fetch session');
    }
  },
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: IUserAuthData, thunkAPI) => {
    try {
      const response = await login({ email, password });
      return response.body;
    } catch {
      return thunkAPI.rejectWithValue('Login failed');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await logout();
      return true;
    } catch {
      return thunkAPI.rejectWithValue('Logout failed');
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedData: Partial<UserState>, { getState }) => {
    const state = getState() as RootState;
    const user = state.user;

    if (!user.version) throw new Error('User version is missing');

    const actions: MyCustomerUpdateAction[] = [];

    if (updatedData.email) {
      actions.push({ action: 'changeEmail', email: updatedData.email });
    }
    if (updatedData.firstName) {
      actions.push({
        action: 'setFirstName',
        firstName: updatedData.firstName,
      });
    }
    if (updatedData.lastName) {
      actions.push({ action: 'setLastName', lastName: updatedData.lastName });
    }
    if (updatedData.dateOfBirth) {
      actions.push({
        action: 'setDateOfBirth',
        dateOfBirth: updatedData.dateOfBirth,
      });
    }

    const response = await apiClient
      .getApiRoot()
      .me()
      .post({
        body: {
          version: user.version,
          actions,
        },
      })
      .execute();

    return mapCustomerToUserState(response.body);
  },
);

export const addAddress = createAsyncThunk<
  Customer | undefined,
  AddressInput,
  { state: RootState }
>('user/addAddress', async (addressData, thunkAPI) => {
  const state = thunkAPI.getState();
  const version = state.user.version;

  if (version === null) throw new Error('User version not found');

  const response = await apiClient
    .getApiRoot()
    .me()
    .post({
      body: {
        version,
        actions: [
          {
            action: 'addAddress',
            address: {
              ...addressData,
            },
          },
        ],
      },
    })
    .execute();

  return response.body;
});

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const user = state.user;
    if (user.version === null) throw new Error('User version not found');

    try {
      const response = await apiClient
        .getApiRoot()
        .me()
        .post({
          body: {
            version: user.version,
            actions: [{ action: 'removeAddress', addressId }],
          },
        })
        .execute();

      return response.body;
    } catch (error) {
      console.log(error);
    }
  },
);

export const updateDefaultAddress = createAsyncThunk<
  Customer | undefined,
  { addressId: string; type: 'billing' | 'shipping' },
  { state: RootState; rejectValue: string }
>('user/updateDefaultAddress', async ({ addressId, type }, thunkAPI) => {
  const state = thunkAPI.getState();
  const version = state.user.version;

  if (version === null) {
    return thunkAPI.rejectWithValue('User version is missing');
  }

  try {
    let action: MyCustomerUpdateAction;

    if (type === 'billing') {
      action = {
        action: 'setDefaultBillingAddress',
        addressId,
      } as MyCustomerSetDefaultBillingAddressAction;
    } else {
      action = {
        action: 'setDefaultShippingAddress',
        addressId,
      } as MyCustomerSetDefaultShippingAddressAction;
    }

    const response = await apiClient
      .getApiRoot()
      .me()
      .post({
        body: {
          version,
          actions: [action],
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    console.error(error);
  }
});

export const changePassword = createAsyncThunk<
  Customer,
  { currentPassword: string; newPassword: string },
  { state: RootState }
>('user/changePassword', async ({ currentPassword, newPassword }, thunkAPI) => {
  const state = thunkAPI.getState();
  const version = state.user.version;

  if (version === null) throw new Error('User not found');

  const response = await apiClient
    .getApiRoot()
    .me()
    .password()
    .post({
      body: {
        version,
        currentPassword,
        newPassword,
      },
    })
    .execute();

  return response.body;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginIn: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
    },
    updateUser: (state, action: PayloadAction<UserState>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.addresses = action.payload.addresses;
      state.defaultBillingAddressId = action.payload.defaultBillingAddressId;
      state.defaultShippingAddressId = action.payload.defaultShippingAddressId;
      state.version = action.payload.version;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromLastSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.firstName = action.payload.firstName || null;
        state.lastName = action.payload.lastName || null;
        state.dateOfBirth = action.payload.dateOfBirth || null;
        state.addresses = action.payload.addresses || [];
        state.defaultBillingAddressId =
          action.payload.defaultBillingAddressId || null;
        state.defaultShippingAddressId =
          action.payload.defaultShippingAddressId || null;
        state.version = action.payload.version || null;
        state.status = RequestStatus.IDLE;
      })
      .addCase(fetchUserFromLastSession.rejected, (state) => {
        state.status = RequestStatus.IDLE;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = RequestStatus.IDLE;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.firstName = action.payload.firstName ?? null;
        state.lastName = action.payload.lastName ?? null;
        state.dateOfBirth = action.payload.dateOfBirth ?? null;
        state.addresses = action.payload.addresses || [];
        state.defaultBillingAddressId =
          action.payload.defaultBillingAddressId || null;
        state.defaultShippingAddressId =
          action.payload.defaultShippingAddressId || null;
        state.version = action.payload.version || null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = RequestStatus.FAILED;
        state.isAuthenticated = false;
        state.email = null;
        state.firstName = null;
        state.lastName = null;
        state.dateOfBirth = null;
        state.addresses = [];
        state.defaultBillingAddressId = null;
        state.defaultShippingAddressId = null;
        state.version = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.email = null;
        state.firstName = null;
        state.lastName = null;
        state.dateOfBirth = null;
        state.addresses = [];
        state.defaultBillingAddressId = null;
        state.defaultShippingAddressId = null;
        state.version = null;
        state.status = RequestStatus.IDLE;
        localStorage.removeItem('userState');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = RequestStatus.FAILED;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        return { ...state, ...action.payload, status: RequestStatus.IDLE };
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.status = RequestStatus.FAILED;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (!action.payload) return;
        const updatedUser = mapCustomerToUserState(action.payload);
        Object.assign(state, updatedUser);
        state.status = RequestStatus.IDLE;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.status = RequestStatus.FAILED;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedUser = mapCustomerToUserState(action.payload);
          Object.assign(state, updatedUser);
        }
      })
      .addCase(updateDefaultAddress.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(updateDefaultAddress.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedUser = mapCustomerToUserState(action.payload);
          Object.assign(state, updatedUser);
          state.status = RequestStatus.IDLE;
        }
      })
      .addCase(updateDefaultAddress.rejected, (state) => {
        state.status = RequestStatus.FAILED;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        const updatedUser = mapCustomerToUserState(action.payload);
        Object.assign(state, updatedUser);
      });
  },
});

export const userReducer = userSlice.reducer;
export const { loginIn, updateUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
