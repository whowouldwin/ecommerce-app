import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { login, logout } from '../../services';
import { IUserAuthData } from '../../types';
import { Status } from '../../enums';

interface UserState {
  isAuthenticated: boolean;
  email: string | null;
  status: Status;
}

const initialState: UserState = {
  isAuthenticated: false,
  email: null,
  status: Status.Idle,
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
    loginOut: (state) => {
      state.isAuthenticated = false;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = Status.Idle;
        state.isAuthenticated = true;
        state.email = action.payload.email;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = Status.Failed;
        state.isAuthenticated = false;
        state.email = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.email = null;
      });
  },
});

export const userReducer = userSlice.reducer;
export const { loginIn, loginOut } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
