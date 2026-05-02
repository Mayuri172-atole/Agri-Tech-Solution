import React, { useEffect, useState } from 'react';
import '../styles/sections/ModernEquipment.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';

const ModernEquipment = () => {
  const { addToCart, cart, wishlist, moveToWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();
  const [allEquip, setAllEquip] = useState([]);

  // 1. Static Equipment (Inhe fallback ki tarah rakhte hain)
  const staticEquipment = [
    { id: 101, name: "Battery Sprayer", brand: "Aspee", price: 4500, originalPrice: 5200, img: "https://cdn-icons-png.flaticon.com/512/2945/2945084.png", stock: 10 },
    { id: 102, name: "Brush Cutter", brand: "Honda", price: 12800, originalPrice: 15000, img: "https://cdn-icons-png.flaticon.com/512/2401/2401035.png", stock: 5 },
    { id: 103, name: "Power Tiller", brand: "Kirloskar", price: 45000, originalPrice: 50000, img: "https://cdn-icons-png.flaticon.com/512/2395/2395796.png", stock: 2 }
  ];

  useEffect(() => {
    const fetchEquipment = () => {
      // 2. LocalStorage se Dynamic data uthao (Admin/Seller data)
      const storedItems = JSON.parse(localStorage.getItem('all_products') || '[]');
      
      const dynamicEquip = storedItems
        .filter(item => item.category === "Modern Equipment" && item.status === 'Live')
        .map(item => ({
          ...item,
          img: item.image || item.img,
          originalPrice: item.originalPrice || item.price 
        }));

      // 🔥 Naya maal (Dynamic) upar, purana (Static) niche
      // Spread operator use karke clean merge
      setAllEquip([...dynamicEquip, ...staticEquipment]);
    };

    fetchEquipment();
    
    // Listen for storage changes (Agar admin side se koi add kare toh bina refresh dikhe)
    window.addEventListener('storage', fetchEquipment);
    return () => window.removeEventListener('storage', fetchEquipment);
  }, []);

  return (
    <section className="modern-equip-section">
      <div className="section-header-pro">
        <h2>Modern Farm Equipment</h2>
        <button className="view-all-btn" onClick={() => navigate('/marketplace?category=Modern Equipment')}>
          View All Machinery
        </button>
      </div>

      <div className="equip-grid">
        {allEquip.map((item) => {
          const isInCart = cart.some((cartItem) => cartItem.id === item.id);
          const isWishlisted = wishlist.some((wItem) => wItem.id === item.id);
          const isOutOfStock = item.stock === 0;

          const handleBuyNow = () => {
            if (isOutOfStock) return;
            if (!isInCart) addToCart({ ...item, image: item.img || item.image });
            navigate('/checkout');
          };

          return (
            <div key={item.id} className="equip-card" style={{ position: 'relative' }}>
              
              {/* Dynamic Tag for items added via Admin/Seller */}
              {item.isDynamic && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#2e7d32', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', zIndex: 3, fontWeight: 'bold' }}>
                  CERTIFIED SELLER
                </div>
              )}

              <div 
                className="wishlist-btn"
                onClick={() => isWishlisted ? removeFromWishlist(item.id) : moveToWishlist({ ...item, image: item.img || item.image })}
                style={{ 
                  position: 'absolute', top: '15px', right: '15px', 
                  cursor: 'pointer', color: isWishlisted ? '#ff5252' : '#999',
                  zIndex: 2, background: '#fff', borderRadius: '50%', padding: '5px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex'
                }}
              >
                {isWishlisted ? <HiHeart size={22} /> : <HiOutlineHeart size={22} />}
              </div>

              <div className="equip-img-hold">
                <img src={item.img || item.image} alt={item.name} />
              </div>

              <div className="equip-details">
                <span className="brand-tag">{item.brand || 'Licensed Dealer'}</span>
                <h3 style={{ minHeight: '44px' }}>{item.name}</h3>
                <div className="price-row">
                  <span className="current-price">₹{Number(item.price).toLocaleString()}</span>
                  {Number(item.originalPrice) > Number(item.price) && (
                    <span className="old-price">₹{Number(item.originalPrice).toLocaleString()}</span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                  <button 
                    className={`add-to-cart-btn ${isInCart ? 'go-to-cart-btn' : ''}`} 
                    onClick={() => {
                      if (isOutOfStock) return;
                      isInCart ? navigate('/cart') : addToCart({ ...item, image: item.img || item.image });
                    }}
                    disabled={isOutOfStock}
                    style={{
                      backgroundColor: isOutOfStock ? '#ccc' : (isInCart ? '#ff9800' : '#2e7d32'),
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      color: '#fff', border: 'none', padding: '10px', width: '100%', borderRadius: '4px', fontWeight: 'bold'
                    }}
                  >
                    {isOutOfStock ? 'Sold Out' : (isInCart ? 'Go to Cart →' : 'Add to Cart')}
                  </button>

                  {!isOutOfStock && (
                    <button 
                      onClick={handleBuyNow}
                      style={{
                        backgroundColor: '#fff', color: '#fb641b', border: '1px solid #fb641b',
                        padding: '10px', width: '100%', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'
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

export default ModernEquipment;