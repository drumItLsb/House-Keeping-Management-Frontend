import type { RootState } from '../../app/Store';

export const selectLoginState = (state: RootState) => state.login;
export const selectIsAuthenticated = (state: RootState) => state.login.isAuthenticated;
export const selectLoginStatus = (state: RootState) => state.login.status;
export const selectLoginError = (state: RootState) => state.login.error;
export const selectCurrentUserName = (state: RootState) => state.login.userName;
export const selectCurrentUserRole = (state: RootState) => state.login.role;
export const selectCurrentUserShift = (state: RootState) => state.login.shift;
export const selectCurrentStaffId = (state: RootState) => state.login.staffId;
export const selectCurrentPropertyId = (state: RootState) => state.login.propertyId;
