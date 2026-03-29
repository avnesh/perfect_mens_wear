import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingProductIndex = state.findIndex(
        (item) => item.product === action.payload.product && item.size === action.payload.size
      );
      if (existingProductIndex >= 0) {
        const updatedState = [...state];
        updatedState[existingProductIndex].qty += action.payload.qty;
        return updatedState;
      }
      return [...state, action.payload];
    }
    case 'REMOVE_FROM_CART':
      return state.filter(
        (item) => !(item.product === action.payload.product && item.size === action.payload.size)
      );
    case 'UPDATE_QTY':
      return state.map((item) =>
        item.product === action.payload.product && item.size === action.payload.size
          ? { ...item, qty: action.payload.qty }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cartItems');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, qty = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, product: product._id, size, qty } });
  };

  const removeFromCart = (productId, size) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { product: productId, size } });
  };

  const updateQty = (productId, size, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { product: productId, size, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
