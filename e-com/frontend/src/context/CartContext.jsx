import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setTotalAmount(0);
      setTotalItems(0);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get('/cart');
      // Backend returns either the list or { "msg": "There is no items in cart" }
      if (res.data && res.data.cart_items) {
        setCartItems(res.data.cart_items);
        setTotalAmount(res.data.total_amount || 0);
        setTotalItems(res.data.total_items || 0);
      } else {
        setCartItems([]);
        setTotalAmount(0);
        setTotalItems(0);
      }
    } catch {
      setCartItems([]);
      setTotalAmount(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  const addToCart = async (productId, quantity, size) => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to your cart');
      return { success: false };
    }
    try {
      await API.post('/addtocart', {
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
        size: parseFloat(size),
      });
      toast.success('Sneaker added to cart!');
      await fetchCart();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add item to cart');
      return { success: false, error: err };
    }
  };

  const updateCart = async (cartItemId, productId, quantity, size) => {
    try {
      await API.put(`/updatecart/${cartItemId}`, {
        product_id: parseInt(productId),
        quantity: parseInt(quantity),
        size: parseFloat(size),
      });
      await fetchCart();
      return { success: true };
    } catch (err) {
      toast.error('Failed to update cart');
      return { success: false, error: err };
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      await API.delete(`/deletecart/${cartItemId}`);
      toast.success('Item removed');
      await fetchCart();
      return { success: true };
    } catch (err) {
      toast.error('Failed to remove item');
      return { success: false, error: err };
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/clearcart');
      setCartItems([]);
      setTotalAmount(0);
      setTotalItems(0);
      return { success: true };
    } catch (err) {
      // If it fails because cart is already empty or other
      setCartItems([]);
      setTotalAmount(0);
      setTotalItems(0);
      return { success: true };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        totalItems,
        loading,
        fetchCart,
        addToCart,
        updateCart,
        deleteCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
