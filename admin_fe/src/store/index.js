import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { SEED_BUSINESSES } from '../constants/businesses';
import { SEED_REDEMPTIONS } from '../constants/rewards';
import storage from './storage';
import navReducer from './slices/navSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import businessesReducer from './slices/businessesSlice';
import rewardsReducer from './slices/rewardsSlice';

const migrations = {
  2: (state) => {
    if (!state?.businesses?.items) return state;
    const savedIds = new Set(state.businesses.items.map((item) => item.id));
    const missing = SEED_BUSINESSES.filter((item) => !savedIds.has(item.id));
    if (!missing.length) return state;
    return {
      ...state,
      businesses: {
        ...state.businesses,
        items: [...state.businesses.items, ...missing],
      },
    };
  },
  3: (state) => {
    if (!state?.businesses?.items) return state;
    const seedById = new Map(SEED_BUSINESSES.map((item) => [item.id, item]));
    return {
      ...state,
      businesses: {
        ...state.businesses,
        items: state.businesses.items.map((item) => {
          const seed = seedById.get(item.id);
          if (!seed) return item;
          return { ...item, socialLinks: seed.socialLinks };
        }),
      },
    };
  },
  4: (state) => {
    if (!state?.rewards || Array.isArray(state.rewards.redemptions)) return state;
    return {
      ...state,
      rewards: { ...state.rewards, redemptions: SEED_REDEMPTIONS, redemptionSeed: 2 },
    };
  },
  5: (state) => {
    if (!state?.rewards || state.rewards.redemptionSeed === 2) return state;
    return {
      ...state,
      rewards: { ...state.rewards, redemptions: SEED_REDEMPTIONS, redemptionSeed: 2 },
    };
  },
};

const persistConfig = {
  key: 'engage-admin',
  version: 5,
  storage,
  whitelist: ['nav', 'auth', 'businesses', 'rewards'],
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  nav: navReducer,
  ui: uiReducer,
  auth: authReducer,
  businesses: businessesReducer,
  rewards: rewardsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
