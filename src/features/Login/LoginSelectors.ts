import type { RootState } from '../../app/Store';

export const selectLoginState = (state: RootState) => state.login;
export const selectIsAuthenticated = (state: RootState) => state.login.isAuthenticated;
export const selectLoginStatus = (state: RootState) => state.login.status;
export const selectLoginError = (state: RootState) => state.login.error;
export const selectCurrentUserName = (state: RootState) => state.login.userName;
