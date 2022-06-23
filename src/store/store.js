import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import cartReducer from '../slices/cartSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {warnAfter: 256},
      serializableCheck: {warnAfter: 256},
    }),
});
