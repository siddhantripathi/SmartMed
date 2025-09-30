import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reducers
import userReducer from './slices/userSlice';
import medicationReducer from './slices/medicationSlice';
import supplementReducer from './slices/supplementSlice';
import interactionReducer from './slices/interactionSlice';
import alertReducer from './slices/alertSlice';
import ocrReducer from './slices/ocrSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['user', 'medications', 'supplements'], // Only persist these slices
};

const rootReducer = {
  user: userReducer,
  medications: medicationReducer,
  supplements: supplementReducer,
  interactions: interactionReducer,
  alerts: alertReducer,
  ocr: ocrReducer,
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
