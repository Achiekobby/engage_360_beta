import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  pendingVerification: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPendingVerification: (state, action) => {
      state.isAuthenticated = true;
      state.pendingVerification = true;
      state.user = action.payload;
    },
    completeVerification: (state) => {
      state.pendingVerification = false;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.pendingVerification = false;
      state.user = action.payload;
    },
    logout: () => initialState,
  },
});

export const { setPendingVerification, completeVerification, login, logout } =
  authSlice.actions;
export default authSlice.reducer;
