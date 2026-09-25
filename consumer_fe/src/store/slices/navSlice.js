import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isScrolled: false,
  mobileMenuOpen: false,
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setScrolled: (state, action) => {
      state.isScrolled = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
  },
});

export const { setScrolled, setMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = navSlice.actions;
export default navSlice.reducer;
