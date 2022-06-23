import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {updateOnOrderPlaced} from '../database/realm';
import axios from '../services/httpService';

export const placeOrder = createAsyncThunk(
  '/cart/placeOrder',
  async (args, {getState, rejectWithValue}) => {
    try {
      const {cartItems} = getState().cart;
      const payload = cartItems.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
      }));
      console.log({payload});
      const {data} = await axios.post('/api/deduct-stock', {
        data: {
          products: payload,
        },
      });
      if (data) {
        console.log({data});
        return;
      }
    } catch (error) {
      if (error && error.message) {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getPurchaseHistory = createAsyncThunk(
  '/cart/getPurchaseHistory',
  async (args, {getState, rejectWithValue}) => {
    try {
      const {data} = await axios.get('/api/purchase-history');
      return data.data.orders;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  cartItems: [],
  orders: [],
  status: 'idle',
  error: null,
  placeOrderStatus: 'idle',
  fetchOrdersStatus: 'idle',
};

const getProductIndex = (state, idToFind) => {
  const productIds = state.cartItems.map(item => item.product.id);
  return productIds.indexOf(idToFind);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productIndex = getProductIndex(state, action.payload.id);
      if (productIndex && productIndex < 0) {
        state.cartItems.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
        });
      } else {
        state.cartItems[productIndex].quantity += action.payload.quantity;
      }
    },
    setPlaceOrderStatus: (state, action) => {
      state.placeOrderStatus = action.payload.status;
    },
    setFetchOrderStatus: (state, action) => {
      state.fetchOrdersStatus = action.payload.status;
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item.product.id !== action.payload.id,
      );
    },
    incrementQuantity: (state, action) => {
      const productIndex = getProductIndex(state, action.payload.id);
      if (productIndex >= 0) {
        state.cartItems[productIndex].quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const productIndex = getProductIndex(state, action.payload.id);
      if (productIndex >= 0) {
        if (state.cartItems[productIndex].quantity > 1) {
          state.cartItems[productIndex].quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(
            item => item.product.id !== action.payload.id,
          );
        }
      }
    },
    resetCart: (state, action) => {
      return initialState;
    },
    resetPlaceOrderStatus: (state, action) => {
      state.placeOrderStatus = 'idle';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(placeOrder.pending, (state, action) => {
        state.placeOrderStatus = 'loading';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        const cartItems = state.cartItems.map(cartItem => ({
          id: cartItem.product.id,
          quantity: cartItem.quantity,
        }));
        updateOnOrderPlaced(cartItems);
        state.cartItems = [];
        state.placeOrderStatus = 'success';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeOrderStatus = 'rejected';
      })
      .addCase(getPurchaseHistory.pending, (state, action) => {
        state.fetchOrdersStatus = 'loading';
      })
      .addCase(getPurchaseHistory.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.fetchOrdersStatus = 'success';
      })
      .addCase(getPurchaseHistory.rejected, (state, action) => {
        state.fetchOrdersStatus = 'rejected';
      });
  },
});

export default cartSlice.reducer;

export const selectCartItems = state => state.cart.cartItems;

export const selectCartItemByCode = (state, productCode) => {
  if (!state.cart) {
    return null;
  }

  const cartItem = state.cart.cartItems.find(
    item => item.product.code === productCode,
  );
  if (!cartItem) {
    return null;
  }
  return cartItem;
};

export const selectCartItemCount = (state, productCode) => {
  const cartItem = selectCartItemByCode(state, productCode);
  if (!cartItem) {
    return null;
  }
  return cartItem.quantity;
};

export const selectPlaceOrderStatus = state => {
  return state.cart.placeOrderStatus;
};

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  resetCart,
  resetPlaceOrderState,
  setPlaceOrderStatus,
  setFetchOrderStatus,
} = cartSlice.actions;
