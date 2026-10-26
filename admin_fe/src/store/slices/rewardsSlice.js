import { createSlice } from '@reduxjs/toolkit';
import { SEED_REDEMPTIONS, SEED_REWARDS } from '../../constants/rewards';

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState: {
    items: SEED_REWARDS,
    redemptions: SEED_REDEMPTIONS,
    redemptionSeed: 2,
  },
  reducers: {
    addReward: (state, action) => {
      state.items.unshift(action.payload);
    },
    setRewardStatus: (state, action) => {
      const { id, status } = action.payload;
      const reward = state.items.find((item) => item.id === id);
      if (reward) reward.status = status;
    },
    setRedemptionStatus: (state, action) => {
      const { id, status } = action.payload;
      const redemption = state.redemptions.find((item) => item.id === id);
      if (redemption) redemption.status = status;
    },
    removeRedemptions: (state, action) => {
      const ids = new Set(action.payload);
      state.redemptions = state.redemptions.filter((item) => !ids.has(item.id));
    },
  },
});

export const { addReward, setRewardStatus, setRedemptionStatus, removeRedemptions } = rewardsSlice.actions;
export default rewardsSlice.reducer;
