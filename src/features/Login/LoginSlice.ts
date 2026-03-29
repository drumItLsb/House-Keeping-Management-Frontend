import { createSlice } from '@reduxjs/toolkit';

import { loginThunk, type LoginResponse, logoutThunk } from './LoginThunk';
import { clearStoredAuth, readStoredAuth } from './LoginStorage';

type LoginStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type LoginState = LoginResponse & {
  error: string | null;
  isAuthenticated: boolean;
  status: LoginStatus;
};

const storedAuth = readStoredAuth();

const initialState: LoginState = {
  error: null,
  isAuthenticated: Boolean(storedAuth?.token),
  role: storedAuth?.role ?? '',
  status: 'idle',
  token: storedAuth?.token ?? '',
  tokenType: storedAuth?.tokenType ?? '',
  userName: storedAuth?.userName ?? '',
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.error = null;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.tokenType = action.payload.tokenType;
        state.userName = action.payload.userName;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Login failed.';
        state.isAuthenticated = false;
        state.role = '';
        state.status = 'failed';
        state.token = '';
        state.tokenType = '';
        state.userName = '';
      })
      .addCase(logoutThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.error = null;
        state.isAuthenticated = false;
        state.role = '';
        state.status = 'idle';
        state.token = '';
        state.tokenType = '';
        state.userName = '';
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Logout failed.';
      });
  },
});

export const { clearLoginError } = loginSlice.actions;
export const resetStoredAuth = () => clearStoredAuth();
export default loginSlice.reducer;
