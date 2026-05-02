import React from 'react';
import { useCart } from '../context/CartContext';
import { HiOutlineTrash, HiOutlineHeart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom'; // 1. Added Navigation
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import '../styles/Cart.css';

const Cart = () => {
  // Destructure moveToWishlist from context
  const { cart, cartCount, removeFromCart, updateQuantity, moveToWishlist } = useCart();
  const navigate = useNavigate(); // 2. Initialize Navigate

  const totalAmount = cart.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);

  return (
    <div className="cart-page-wrapper">
      <Navbar />
      <div className="cart-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>My Shopping Cart ({cartCount})</h2>
        
        {cart.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is feeling light. Add some AgriMart products!</p>
            <a href="/" className="back-btn">Back to Shopping</a>
          </div>
        ) : (
          <div className="cart-flex" style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
            <div style={{ flex: 2 }}>
              {cart.map((item, index) => (
                <div key={item.id || index} className="cart-card" style={{ display: 'flex', background: '#fff', padding: '15px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                  
                  <div style={{ marginLeft: '20px', flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                    <p style={{ color: '#666', fontSize: '12px' }}>{item.brand}</p>
                    
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Qty:</label>
                       <select 
                         value={item.quantity} 
                         onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                         style={{ padding: '2px 5px', borderRadius: '4px', border: '1px solid #ccc' }}
                       >
                         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                           <option key={num} value={num}>{num}</option>
                         ))}
                       </select>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                        {/* 3. Connected Move to Wishlist */}
                        <button 
                          onClick={() => moveToWishlist(item)} 
                          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600' }}
                        >
                          <HiOutlineHeart /> MOVE TO WISHLIST
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600' }}
                        >
                          <HiOutlineTrash /> REMOVE
                        </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#2e7d32' }}>
                      ₹{Number(item.price) * (item.quantity || 1)}
                    </div>
                    {item.quantity > 1 && (
                       <div style={{ fontSize: '11px', color: '#999' }}>₹{item.price} each</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee', height: 'fit-content' }}>
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Price Details</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                <span>Price ({cartCount} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0', color: '#2e7d32' }}>
                <span>Delivery Charges</span>
                <span style={{ fontWeight: 'bold' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
              
              {/* 4. Connected Checkout Navigation */}
              <button 
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', padding: '12px', background: '#ff9800', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;