import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/sections/DealsSection.css';

const DealsSection = () => {
  const [allDeals, setAllDeals] = useState([]);

  // 1. Static Deals (Fallback Data)
  const staticProducts = [
    { id: 's1', name: "Acrobat Fungicide", brand: "BASF", price: 599, originalPrice: 849, discount: 29, size: "100 gms", tag: "Lowest Price Deal", image: "https://via.placeholder.com/150" },
    { id: 's2', name: "Katyayani NPK 19:19:19", brand: "Katyayani Organics", price: 343, originalPrice: 664, discount: 48, size: "1 kg", tag: "Lowest Price Deal", image: "https://via.placeholder.com/150" },
    { id: 's3', name: "Geolife No-Virus", brand: "Geolife Agritech", price: 271, originalPrice: 700, discount: 61, size: "250 ml", tag: "Trending Now", image: "https://via.placeholder.com/150" },
    { id: 's4', name: "Simodis Insecticide", brand: "Syngenta", price: 759, originalPrice: 1029, discount: 26, size: "80 ml", tag: "Lowest Price Deal", image: "https://via.placeholder.com/150" },
  ];

  useEffect(() => {
    const fetchDeals = () => {
      // 2. LocalStorage se Maal uthao
      const storedItems = JSON.parse(localStorage.getItem('all_products') || '[]');

      // Filter: Sirf wo products jinka discount 20% se zyada hai
      const dynamicDeals = storedItems
        .filter(item => {
          if (!item.originalPrice || item.originalPrice <= item.price) return false;
          
          const discPercent = ((item.originalPrice - item.price) / item.originalPrice) * 100;
          return discPercent >= 20 && item.status === 'Live';
        })
        .map(item => ({
          ...item,
          tag: "Limited Offer 🔥", 
          image: item.image || item.img
        }));

      // Merge & Limit: Sabse bade discounts pehle dikhao
      const finalDisplay = [...dynamicDeals, ...staticProducts]
        .sort((a, b) => {
          const discA = ((a.originalPrice - a.price) / a.originalPrice);
          const discB = ((b.originalPrice - b.price) / b.originalPrice);
          return discB - discA; // Higher discount first
        })
        .slice(0, 8); // Sirf 8 top deals
      
      setAllDeals(finalDisplay);
    };

    fetchDeals();

    // Live update when storage changes
    window.addEventListener('storage', fetchDeals);
    return () => window.removeEventListener('storage', fetchDeals);
  }, []);

  return (
    <section className="deals-container">
      <div className="deals-header">
        <div className="title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, color: '#d32f2f' }}>Today's Offer ⚡</h2>
            {allDeals.length > staticProducts.length && (
              <span className="live-badge" style={{ 
                background: '#e67e22', color: '#fff', fontSize: '10px', 
                padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold',
                animation: 'pulse 1.5s infinite' 
              }}>LIVE DEALS</span>
            )}
          </div>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Grab the best farming discounts before they're gone!</p>
        </div>
        <button className="view-all-btn" onClick={() => navigate('/marketplace?sort=discount')}>
          View All
        </button>
      </div>
      
      <div className="deals-grid">
        {allDeals.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;