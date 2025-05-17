import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store.ts';
import { login, logout } from '../../services';
import { IUserAuthData } from '../../types';
import { RequestStatus, LocalStorageKey } from '../../enums/appEnums.ts';
import { getDataFromLS } from '../../services';

interface UserState {
  isAuthenticated: boolean;
  email: string | null;
  status: RequestStatus;
}

const sessionData = getDataFromLS(LocalStorageKey.SESSION);
const isAuthenticated = Boolean(sessionData?.token);

const savedUserState = localStorage.getItem('userState');
let parsedUserState: UserState | null = null;

if (savedUserState) {
  try {
    parsedUserState = JSON.parse(savedUserState);
  } catch (e) {
    console.error('Failed to parse user state from localStorage', e);
  }
}

const initialState: UserState = parsedUserState || {
  isAuthenticated,
  email: null,
  status: RequestStatus.IDLE,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: IUserAuthData, thunkAPI) => {
    try {
      await login({ email, password });
      return { email };
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginIn: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = RequestStatus.IDLE;
        state.isAuthenticated = true;
        state.email = action.payload.email;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = RequestStatus.FAILED;
        state.isAuthenticated = false;
        state.email = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.email = null;
        state.status = RequestStatus.IDLE;
        localStorage.removeItem('userState');
      });
  },
});

export const userReducer = userSlice.reducer;
export const { loginIn } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
