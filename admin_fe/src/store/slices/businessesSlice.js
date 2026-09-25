import { createSlice } from '@reduxjs/toolkit';
import { SEED_BUSINESSES } from '../../constants/businesses';

const businessesSlice = createSlice({
  name: 'businesses',
  initialState: {
    items: SEED_BUSINESSES,
  },
  reducers: {
    addBusiness: (state, action) => {
      state.items.unshift(action.payload);
    },
    removeBusinesses: (state, action) => {
      const ids = new Set(action.payload);
      state.items = state.items.filter((item) => !ids.has(item.id));
    },
    updateBusiness: (state, action) => {
      const { id, changes } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;
      Object.assign(item, changes);
    },
  },
});

export const { addBusiness, removeBusinesses, updateBusiness } = businessesSlice.actions;
export default businessesSlice.reducer;
