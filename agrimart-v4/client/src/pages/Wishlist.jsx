import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5000/api/users';
const Wishlist = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Fetch wishlist from DB on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API}/wishlist`, { headers });
        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Wishlist fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await fetch(`${API}/wishlist/remove/${productId}`, { method: 'DELETE', headers });
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item._id);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Navbar />Loading wishlist...</div>;

  return (
    <div className="wishlist-page">
      <Navbar />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '70vh' }}>
        <h2 style={{ borderBottom: '2px solid #2e7d32', paddingBottom: '10px' }}>My Wishlist ❤️</h2>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Your wishlist is empty!</p>
            <button onClick={() => navigate('/')}
              style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
              Explore Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
            {wishlist.map((item) => (
              <div key={item._id} style={{ background: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #eee', textAlign: 'center' }}>
                <img src={item.image || item.img} alt={item.name}
                  style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
                <h4 style={{ margin: '15px 0 5px' }}>{item.name}</h4>
                <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '18px' }}>₹{item.price}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => handleAddToCart(item)}
                    style={{ flex: 1, background: '#ff9800', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <HiOutlineShoppingCart /> Add to Cart
                  </button>
                  <button onClick={() => removeFromWishlist(item._id)}
                    style={{ background: '#f5f5f5', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', color: '#ff5252' }}>
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;