import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const API = 'http://localhost:5000/api/users';
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const CartProvider = ({ children }) => {
  const [cart, setCart]       = useState([]);
  const [orders, setOrders]   = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ✅ Fetch wishlist from MongoDB on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // Not logged in, skip
    fetch(`${API}/wishlist`, { headers: getHeaders() })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setWishlist(data); })
      .catch(err => console.error('Wishlist fetch failed:', err));
  }, []);

  // --- CART LOGIC (unchanged) ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => (item._id || item.id) === (product._id || product.id));
      if (existingItem) {
        return prevCart.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`, {
      id: product._id || product.id, duration: 3000, position: 'top-right',
      style: { border: '1px solid #2e7d32', padding: '16px', color: '#2e7d32', fontWeight: '600', borderRadius: '8px', background: '#fff' },
      iconTheme: { primary: '#2e7d32', secondary: '#fff' },
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => (item._id || item.id) !== productId));
    toast.error("Item removed from cart", {
      id: "cart-remove-action",
      style: { borderRadius: '8px', background: '#333', color: '#fff' }
    });
  };

  const updateQuantity = (productId, newQty) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // --- WISHLIST LOGIC (now syncs with MongoDB) ---
  const moveToWishlist = async (product) => {
    const productId = product._id || product.id;

    // Remove from cart
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== productId));

    // Check already in wishlist
    if (wishlist.find(item => (item._id || item.id) === productId)) {
      toast('Already in wishlist!', { icon: '❤️', id: 'wishlist-exists' });
      return;
    }

    try {
      await fetch(`${API}/wishlist/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId })
      });
      setWishlist(prev => [...prev, product]); // ✅ Update local state too
      toast(`${product.name} moved to wishlist!`, {
        id: 'wishlist-action', icon: '❤️',
        style: { borderRadius: '8px', background: '#fff', color: '#333', border: '1px solid #ff4b2b' }
      });
    } catch (err) {
      toast.error('Wishlist save failed!');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await fetch(`${API}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId)); // ✅ Update local state
      toast.error("Removed from wishlist", { id: "wishlist-remove" });
    } catch (err) {
      toast.error('Remove failed!');
    }
  };

  // --- ORDER LOGIC ---
  const clearCart = () => {
    setOrders((prev) => [...prev, ...cart]);
    setCart([]);
  };

  const cartCount    = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider value={{
      cart, orders, wishlist,
      addToCart, removeFromCart, updateQuantity,
      moveToWishlist, removeFromWishlist,
      clearCart, cartCount, wishlistCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};