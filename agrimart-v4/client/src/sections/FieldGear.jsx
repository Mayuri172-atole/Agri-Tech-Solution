import React, { useEffect, useState } from 'react';
import '../styles/sections/FieldGear.css';
import { useCart } from '../context/CartContext'; 
import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'; 

const FieldGear = () => {
  const { addToCart, cart, wishlist, moveToWishlist, removeFromWishlist } = useCart(); 
  const navigate = useNavigate();
  const [allGear, setAllGear] = useState([]);

  // 1. Static Gear (Fallback items)
  const staticGear = [
    { id: "GEAR-01", name: "Rubber Safety Boots", price: 1200, img: "https://cdn-icons-png.flaticon.com/512/2872/2872620.png", stock: 12 },
    { id: "GEAR-02", name: "Protective Gloves", price: 350, img: "https://cdn-icons-png.flaticon.com/512/10332/10332306.png", stock: 50 },
    { id: "GEAR-03", name: "Wide Brim Sun Hat", price: 450, img: "https://cdn-icons-png.flaticon.com/512/3233/3233861.png", stock: 20 },
    { id: "GEAR-04", name: "Farmer Apron", price: 600, img: "https://cdn-icons-png.flaticon.com/512/863/863684.png", stock: 15 },
  ];

  useEffect(() => {
    const fetchGear = () => {
      // 2. LocalStorage se Dynamic data uthao (Admin/Seller entry)
      const storedItems = JSON.parse(localStorage.getItem('all_products') || '[]');
      
      const dynamicGear = storedItems
        .filter(item => item.category === "Field Gear" && item.status === 'Live')
        .map(item => ({
          ...item,
          img: item.image || item.img,
          isNew: true // Flag for "NEW" badge
        }));

      // Merge: Naya maal pehle, static niche
      setAllGear([...dynamicGear, ...staticGear]);
    };

    fetchGear();

    // Power Feature: Doosre tab mein Admin kuch add kare toh yahan turant dikhega
    window.addEventListener('storage', fetchGear);
    return () => window.removeEventListener('storage', fetchGear);
  }, []);

  return (
    <section className="field-gear-section" style={{ padding: '40px 20px' }}>
      <div className="section-header-pro">
        <h2>Protective Field Gear</h2>
        <button className="view-all-btn" onClick={() => navigate('/marketplace?category=Field Gear')}>
          View All Gear
        </button>
      </div>

      <div className="gear-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        {allGear.map(item => {
          const isInCart = cart.some(cartItem => cartItem.id === item.id);
          const isWishlisted = wishlist.some(wItem => wItem.id === item.id);
          const isOutOfStock = item.stock === 0;

          const handleBuyNow = () => {
            if (isOutOfStock) return;
            if (!isInCart) addToCart({ ...item, image: item.img || item.image });
            navigate('/checkout');
          };

          return (
            <div key={item.id} className="gear-card" style={{ 
              position: 'relative', 
              padding: '15px', 
              border: '1px solid #eee', 
              borderRadius: '8px',
              backgroundColor: '#fff',
              transition: '0.3s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              
              {/* WISHLIST ICON */}
              <div 
                className="wishlist-heart"
                onClick={() => isWishlisted ? removeFromWishlist(item.id) : moveToWishlist({ ...item, image: item.img || item.image })}
                style={{ 
                  position: 'absolute', top: '10px', right: '10px', 
                  cursor: 'pointer', color: isWishlisted ? '#ff5252' : '#999',
                  zIndex: 2, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '4px'
                }}
              >
                {isWishlisted ? <HiHeart size={22} /> : <HiOutlineHeart size={22} />}
              </div>

              {/* Dynamic "New" Badge - Optimized Logic */}
              {(item.isNew || isNaN(item.id)) && (
                <div style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: '#2e7d32', color: '#fff', fontSize: '10px',
                  padding: '2px 8px', borderRadius: '4px', zIndex: 2, fontWeight: 'bold'
                }}>
                  NEW
                </div>
              )}
              
              <div className="gear-img" style={{ textAlign: 'center', marginBottom: '10px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.img || item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>

              <div className="gear-info">
                <h3 style={{ fontSize: '16px', margin: '5px 0', minHeight: '40px' }}>{item.name}</h3>
                <p style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '18px' }}>
                  ₹{Number(item.price).toLocaleString()}
                </p>
                
                <div className="gear-actions" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className={`gear-buy-btn ${isInCart ? 'go-to-cart-gear' : ''}`}
                    onClick={() => {
                      if (isOutOfStock) return;
                      isInCart ? navigate('/cart') : addToCart({ ...item, image: item.img || item.image });
                    }}
                    disabled={isOutOfStock}
                    style={{
                      backgroundColor: isOutOfStock ? '#ccc' : (isInCart ? '#ff9800' : '#2e7d32'),
                      color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isOutOfStock ? 'Sold Out' : (isInCart ? 'Go to Cart →' : 'Add to Cart')}
                  </button>

                  {!isOutOfStock && (
                    <button 
                      onClick={handleBuyNow}
                      style={{
                        backgroundColor: '#fff', color: '#fb641b', border: '1px solid #fb641b',
                        padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
                      }}
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FieldGear;