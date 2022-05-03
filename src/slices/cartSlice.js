import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  status: 'idle',
  error: null,
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
    removeFromCart: (state, action) => {
      console.log('payload', action.payload);
      state.cartItems = state.cartItems.filter(
        item => item.product.id !== action.payload.id,
      );
    },
    incrementQuantity: (state, action) => {
      console.log('payload', action.payload);
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
    resetCart: (state, action) => initialState,
  },
});

export default cartSlice.reducer;

export const selectCartItems = state => state.cart.cartItems;

export const selectCartItemByCode = (state, productCode) => {
  cartItem = state.cart.cartItems.find(
    cartItem => cartItem.product.code === productCode,
  );
  if (cartItem) {
    return cartItem;
  } else {
    return null;
  }
};

export const selectCartItemCount = (state, productCode) => {
  cartItem = selectCartItemByCode(productCode);
  if (cartItem) {
    const itemCount = cartItem.quantity;
    return itemCount;
  } else {
    return null;
  }
};

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  resetCart,
} = cartSlice.actions;
