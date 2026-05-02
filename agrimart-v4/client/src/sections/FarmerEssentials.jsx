import React, { useEffect, useState } from 'react';
import '../styles/sections/FarmerEssentials.css';
import { useNavigate } from 'react-router-dom';

const FarmerEssentials = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  // 1. Static Categories (Fixed UI structure)
  const items = [
    { id: 1, title: "Animal Husbandry", color: "#e8f5e9", img: "https://cdn-icons-png.flaticon.com/512/2395/2395796.png", categoryKey: "Animal" },
    { id: 2, title: "Farm Machinery", color: "#fff3e0", img: "https://cdn-icons-png.flaticon.com/512/2401/2401035.png", categoryKey: "Modern Equipment" },
    { id: 3, title: "Garden Tools", color: "#e1f5fe", img: "https://cdn-icons-png.flaticon.com/512/1518/1518965.png", categoryKey: "Traditional Tools" },
    { id: 4, title: "Irrigation", color: "#f3e5f5", img: "https://cdn-icons-png.flaticon.com/512/2945/2945084.png", categoryKey: "Irrigation" },
  ];

  useEffect(() => {
    const updateStats = () => {
      // 2. Extra Swag: Real-time product counting logic
      const allProducts = JSON.parse(localStorage.getItem('all_products') || '[]');
      const stats = {};
      
      allProducts.forEach(p => {
        // Sirf 'Live' products ko count karte hain
        if (p.status === 'Live' || !p.status) {
          stats[p.category] = (stats[p.category] || 0) + 1;
        }
      });
      
      setCounts(stats);
    };

    updateStats();

    // Jab Admin panel se product add/delete ho, toh count turant badle
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  const handleNavigation = (category) => {
    navigate(`/marketplace?category=${category}`);
  };

  return (
    <section className="essentials-wrapper">
      <div className="section-header-pro">
        <h2 className="section-title">Farmer Essentials</h2>
        <span className="stock-update">Updated Live</span>
      </div>

      <div className="essentials-grid">
        {items.map(item => (
          <div 
            key={item.id} 
            className="essential-card" 
            style={{ 
              backgroundColor: item.color, 
              cursor: 'pointer',
              transition: '0.3s transform' 
            }}
            onClick={() => handleNavigation(item.categoryKey)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="essential-text">
              <h3 style={{ margin: '0', fontSize: '18px' }}>{item.title}</h3>
              <p style={{ fontSize: '12px', color: '#666', margin: '5px 0', fontWeight: '500' }}>
                {counts[item.categoryKey] 
                  ? `${counts[item.categoryKey]} Products Available` 
                  : 'Explore Collection'}
              </p>
              <button 
                className="essential-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2e7d32',
                  fontWeight: 'bold',
                  padding: '0',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                Shop Now →
              </button>
            </div>
            <img src={item.img} alt={item.title} className="essential-icon" style={{ width: '60px', height: '60px', opacity: '0.9' }} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FarmerEssentials;