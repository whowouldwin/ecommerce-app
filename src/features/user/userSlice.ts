import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenStore } from '@commercetools/ts-client';
import { RootState } from '../../store/store';
import { login, logout, verifyAuthentication } from '../../services';
import { IUserAuthData } from '../../types';
import { RequestStatus, LocalStorageKey } from '../../enums/appEnums';
import { getDataFromLS } from '../../services';

interface UserState {
  isAuthenticated: boolean;
  email: string | null;
  status: RequestStatus;
  isVerifying: boolean;
}

const loadUserState = (): UserState | undefined => {
  try {
    const raw = localStorage.getItem('userState');
    if (!raw) return undefined;

    const parsed = JSON.parse(raw);

    return {
      ...parsed,
      isVerifying: false,
    };
  } catch (error) {
    console.error('Failed to load user state from localStorage:', error);
    return undefined;
  }
};

const saveUserState = (state: UserState) => {
  try {
    const stateToSave = {
      ...state,
      isVerifying: false,
    };

    localStorage.setItem('userState', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save user state to localStorage:', error);
  }
};

const session: TokenStore | null = getDataFromLS(LocalStorageKey.SESSION);
const hasToken = Boolean(session?.token);

const persisted = loadUserState();

const initialState: UserState = persisted
  ? {
      ...persisted,
      isVerifying: hasToken,
      status: hasToken ? RequestStatus.LOADING : RequestStatus.IDLE,
    }
  : {
      isAuthenticated: false,
      email: null,
      status: hasToken ? RequestStatus.LOADING : RequestStatus.IDLE,
      isVerifying: hasToken,
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

export const verifyAuth = createAsyncThunk(
  'user/verify',
  async (_, thunkAPI) => {
    try {
      const userData = await verifyAuthentication();
      return userData;
    } catch {
      return thunkAPI.rejectWithValue('Authentication verification failed');
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
        state.isVerifying = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = RequestStatus.IDLE;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.isVerifying = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = RequestStatus.FAILED;
        state.isAuthenticated = false;
        state.email = null;
        state.isVerifying = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = RequestStatus.LOADING;
        state.isVerifying = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.email = null;
        state.status = RequestStatus.IDLE;
        state.isVerifying = false;
        localStorage.removeItem('userState');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = RequestStatus.FAILED;
        state.isVerifying = false;
      })
      .addCase(verifyAuth.pending, (state) => {
        state.status = RequestStatus.LOADING;
        state.isVerifying = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.status = RequestStatus.IDLE;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.isVerifying = false;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.status = RequestStatus.IDLE;
        state.isAuthenticated = false;
        state.email = null;
        state.isVerifying = false;
      })
      .addMatcher(
        (action) =>
          action.type === 'user/login/fulfilled' ||
          action.type === 'user/logout/fulfilled' ||
          action.type === 'user/verify/fulfilled' ||
          action.type === 'user/verify/rejected',
        (state) => {
          saveUserState(state);
        },
      );
  },
});

export const userReducer = userSlice.reducer;
export const { loginIn } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
