import React, { useEffect, useState } from 'react';
import '../styles/sections/TraditionalTools.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';

const TraditionalTools = () => {
  const { addToCart, cart, wishlist, moveToWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();
  const [allTools, setAllTools] = useState([]);

  // 1. Static Tools (Fixed Fallback Data)
  const staticTools = [
    { id: 201, name: "Steel Sickle", price: 250, img: "https://cdn-icons-png.flaticon.com/512/1052/1052856.png", brand: "AgriPro", stock: 10 },
    { id: 202, name: "Hand Cultivator", price: 450, img: "https://cdn-icons-png.flaticon.com/512/1518/1518965.png", brand: "AgriPro", stock: 5 },
    { id: 203, name: "Digging Fork", price: 890, img: "https://cdn-icons-png.flaticon.com/512/2945/2945038.png", brand: "TATA", stock: 8 },
    { id: 204, name: "Garden Trowel", price: 180, img: "https://cdn-icons-png.flaticon.com/512/3043/3043818.png", brand: "Falcon", stock: 0 },
  ];

  useEffect(() => {
    const fetchTools = () => {
      // 2. LocalStorage se Dynamic data uthao (Admin/Seller entry)
      const storedItems = JSON.parse(localStorage.getItem('all_products') || '[]');
      
      const dynamicTools = storedItems
        .filter(item => item.category === "Traditional Tools" && item.status === 'Live')
        .map(item => ({
          ...item,
          img: item.image || item.img // Ensuring image key consistency
        }));

      // Merge: Naya dynamic maal list ke shuruat mein aayega
      setAllTools([...dynamicTools, ...staticTools]);
    };

    fetchTools();

    // Jab admin panel se naya tool add ho, bina refresh update ho jaye
    window.addEventListener('storage', fetchTools);
    return () => window.removeEventListener('storage', fetchTools);
  }, []);

  return (
    <section className="traditional-tools-section">
      <div className="section-header-pro">
        <h2>Traditional Hand Tools</h2>
        <button className="view-all-btn" onClick={() => navigate('/marketplace?category=Traditional Tools')}>
          Shop Collection
        </button>
      </div>

      <div className="tools-list">
        {allTools.map(tool => {
          const isInCart = cart.some(item => item.id === tool.id);
          const isWishlisted = wishlist.some(wItem => wItem.id === tool.id);
          const isOutOfStock = tool.stock === 0;

          const handleBuyNow = () => {
            if (isOutOfStock) return;
            if (!isInCart) addToCart({ ...tool, image: tool.img || tool.image });
            navigate('/checkout');
          };

          return (
            <div key={tool.id} className="tool-horizontal-card" style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '15px' }}>
              
              <div className="tool-img-box">
                <img src={tool.img || tool.image} alt={tool.name} style={{ width: '80px', objectFit: 'contain' }} />
                {/* Dynamic badge for backend added items */}
                {tool.id > 1000 && (
                  <span style={{ position: 'absolute', top: 0, left: 0, background: '#2e7d32', color: 'white', fontSize: '8px', padding: '2px 5px', fontWeight: 'bold' }}>
                    NEW
                  </span>
                )}
              </div>

              <div className="tool-info" style={{ flex: 1, paddingLeft: '15px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{tool.name}</h4>
                <p className="tool-price" style={{ color: '#2e7d32', fontWeight: 'bold', margin: '0' }}>
                  ₹{Number(tool.price).toLocaleString()}
                </p>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                  <button 
                    className={`buy-mini-btn ${isInCart ? 'go-to-cart-mini' : ''}`}
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (isOutOfStock) return;
                      isInCart ? navigate('/cart') : addToCart({ ...tool, image: tool.img || tool.image }); 
                    }}
                    style={{
                      backgroundColor: isOutOfStock ? '#ccc' : (isInCart ? '#ff9800' : '#2e7d32'),
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px'
                    }}
                  >
                    {isOutOfStock ? 'Sold' : (isInCart ? 'Go →' : 'Add +')}
                  </button>

                  {!isOutOfStock && (
                    <button 
                      onClick={handleBuyNow}
                      style={{
                        background: 'none', border: '1px solid #fb641b', color: '#fb641b',
                        padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'
                      }}
                    >
                      BUY
                    </button>
                  )}

                  <div 
                    onClick={() => isWishlisted ? removeFromWishlist(tool.id) : moveToWishlist({ ...tool, image: tool.img || tool.image })}
                    style={{ cursor: 'pointer', color: isWishlisted ? '#ff5252' : '#999', display: 'flex', marginLeft: '5px' }}
                  >
                    {isWishlisted ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TraditionalTools;