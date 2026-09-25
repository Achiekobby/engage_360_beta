import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  campaignModalOpen: false,
  loginModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCampaignModal: (state) => {
      state.campaignModalOpen = true;
    },
    closeCampaignModal: (state) => {
      state.campaignModalOpen = false;
    },
    openLoginModal: (state) => {
      state.loginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },
  },
});

export const {
  openCampaignModal,
  closeCampaignModal,
  openLoginModal,
  closeLoginModal,
} = uiSlice.actions;
export default uiSlice.reducer;
