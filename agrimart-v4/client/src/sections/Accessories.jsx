import React, { useEffect, useState } from 'react';
import '../styles/sections/Accessories.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';

const Accessories = () => {
  const { addToCart, cart, wishlist, moveToWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();
  const [allAccs, setAllAccs] = useState([]);

  // 1. Static Accessories (Baseline Essentials)
  const staticAccessories = [
    { id: "ACC-01", name: "Mist Nozzle Set", price: 120, category: "Irrigation", img: "https://cdn-icons-png.flaticon.com/512/3563/3563457.png", stock: 20 },
    { id: "ACC-02", name: "T-Joint Pipe (5pk)", price: 210, category: "Plumbing", img: "https://cdn-icons-png.flaticon.com/512/3223/3223368.png", stock: 15 },
    { id: "ACC-03", name: "PVC Hose Pipe", price: 850, category: "Watering", img: "https://cdn-icons-png.flaticon.com/512/2945/2945084.png", stock: 10 },
    { id: "ACC-04", name: "Battery Charger", price: 1100, category: "Electronics", img: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png", stock: 0 },
  ];

  const fetchAccessories = () => {
    // 2. Data uthao aur category "Accessories" filter karo
    const storedItems = JSON.parse(localStorage.getItem('all_products') || '[]');
    
    const dynamicAccs = storedItems
      .filter(item => item.category === "Accessories" && item.status === 'Live')
      .map(item => ({
        ...item,
        img: item.image || item.img
      }));

    // Merge: Naya dynamic maal niche, static essentials upar
    setAllAccs([...staticAccessories, ...dynamicAccs]);
  };

  useEffect(() => {
    fetchAccessories();

    // Listen for changes (Live Update)
    window.addEventListener('storage', fetchAccessories);
    return () => window.removeEventListener('storage', fetchAccessories);
  }, []);

  return (
    <section className="accessories-section" style={{ padding: '30px 20px', backgroundColor: '#fff' }}>
      <div className="section-header-pro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#2d3436' }}>Essential Accessories</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#636e72' }}>Genuine spare parts for your farm equipment</p>
        </div>
        <button className="view-all-btn" onClick={() => navigate('/marketplace?category=Accessories')} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #2e7d32', background: 'none', color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold' }}>
          Browse All Spares
        </button>
      </div>

      <div className="acc-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: '#fcfcfc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f1f1f1' }}>
        {allAccs.map(item => {
          const isInCart = cart.some(cartItem => cartItem.id === item.id);
          const isWishlisted = wishlist.some(wItem => wItem.id === item.id);
          const isOutOfStock = item.stock === 0;

          const handleBuyNow = () => {
            if (isOutOfStock) return;
            if (!isInCart) addToCart({ ...item, image: item.img || item.image });
            navigate('/checkout');
          };

          return (
            <div key={item.id} className="acc-row" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              padding: '12px 15px', 
              borderBottom: '1px solid #f1f1f1',
              transition: 'background 0.2s',
              backgroundColor: isOutOfStock ? '#fafafa' : '#fff'
            }}>
              
              <div className="acc-img-small" style={{ background: '#f8f9fa', padding: '5px', borderRadius: '8px' }}>
                <img src={item.img || item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', filter: isOutOfStock ? 'grayscale(1)' : 'none' }} />
              </div>

              <div className="acc-text" style={{ flex: 1 }}>
                <span className="acc-cat" style={{ fontSize: '10px', color: '#2e7d32', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {item.category}
                </span>
                <h4 style={{ margin: '2px 0', fontSize: '15px', color: isOutOfStock ? '#999' : '#2d3436' }}>
                  {item.name} {isOutOfStock && <span style={{ color: '#d32f2f', fontSize: '10px' }}>(Sold Out)</span>}
                </h4>
              </div>

              <div className="acc-price-action" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="acc-price" style={{ fontWeight: '800', color: '#2d3436', fontSize: '16px' }}>₹{item.price}</span>
                
                <div 
                  className="acc-wish-icon"
                  onClick={() => isWishlisted ? removeFromWishlist(item.id) : moveToWishlist({ ...item, image: item.img || item.image })}
                  style={{ cursor: 'pointer', color: isWishlisted ? '#ff5252' : '#bdc3c7' }}
                >
                  {isWishlisted ? <HiHeart size={22} /> : <HiOutlineHeart size={22} />}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!isOutOfStock && (
                    <button 
                      onClick={handleBuyNow}
                      style={{ background: '#fff', border: '1px solid #fb641b', color: '#fb641b', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      BUY
                    </button>
                  )}

                  <button 
                    className="acc-add-btn" 
                    onClick={() => {
                      if (isOutOfStock) return;
                      isInCart ? navigate('/cart') : addToCart({ ...item, image: item.img || item.image });
                    }}
                    disabled={isOutOfStock}
                    style={{
                      backgroundColor: isOutOfStock ? '#eee' : (isInCart ? '#ff9800' : '#2e7d32'),
                      color: isOutOfStock ? '#999' : '#fff', 
                      border: 'none', 
                      padding: '6px 18px', 
                      borderRadius: '6px', 
                      fontWeight: 'bold', 
                      minWidth: '85px',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {isOutOfStock ? 'OUT' : (isInCart ? 'GO →' : 'ADD')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Accessories;