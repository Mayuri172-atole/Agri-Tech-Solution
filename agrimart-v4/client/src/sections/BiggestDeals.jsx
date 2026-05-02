import React, { useEffect, useState } from 'react';
import '../styles/sections/BiggestDeals.css';

const BiggestDeals = () => {
  const [activeBanners, setActiveBanners] = useState([]);

  // 1. Static Professional Ads (Baseline Content)
  const staticBanners = [
    { id: 's1', title: "Shield your crops from viral diseases", sub: "with No-Virus!", color: "#e8f5e9", img: "https://via.placeholder.com/300x400" },
    { id: 's2', title: "Improve fruit set & quality", sub: "with Amino Maxx!", color: "#fff3e0", img: "https://via.placeholder.com/300x400" },
  ];

  useEffect(() => {
    const generateBanners = () => {
      // 2. Data fetch logic
      const allProducts = JSON.parse(localStorage.getItem('all_products') || '[]');

      // Filter: Licensed products with massive price drops
      const dynamicDeals = allProducts
        .filter(p => p.status === 'Live' && p.originalPrice > p.price)
        .sort((a, b) => {
          // Calculate percentage discount for better sorting
          const discA = ((a.originalPrice - a.price) / a.originalPrice);
          const discB = ((b.originalPrice - b.price) / b.originalPrice);
          return discB - discA;
        })
        .slice(0, 2) // Top 2 deals of the day
        .map(p => {
          const discPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
          return {
            id: p.id,
            title: `Save ${discPercent}% on ${p.name}`,
            sub: `Lowest price ever: ₹${Number(p.price).toLocaleString()}!`,
            color: "#f3e5f5", // Unique shade for deals
            img: p.image || p.img,
            isDeal: true
          };
        });

      // Merge: Dynamic deals pehle dikhenge
      setActiveBanners([...dynamicDeals, ...staticBanners]);
    };

    generateBanners();

    // Jab admin deal change kare, banner turant badle
    window.addEventListener('storage', generateBanners);
    return () => window.removeEventListener('storage', generateBanners);
  }, []);

  return (
    <section className="biggest-deals-wrapper">
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Exclusive Offers 🔥</h2>
        <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>HURRY! LIMITED TIME</span>
      </div>

      <div className="banners-grid">
        {activeBanners.map((banner) => (
          <div key={banner.id} className="banner-card" style={{ 
            backgroundColor: banner.color,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Discount Badge for dynamic items */}
            {banner.isDeal && (
              <div style={{
                position: 'absolute', top: '10px', left: '-30px',
                background: '#d32f2f', color: '#fff', padding: '5px 40px',
                transform: 'rotate(-45deg)', fontSize: '10px', fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                DEAL
              </div>
            )}

            <div className="banner-text">
              <h3 style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2' }}>{banner.title}</h3>
              <p style={{ margin: '10px 0 20px 0', opacity: 0.8 }}>{banner.sub}</p>
              <button className="banner-shop-btn">Grab Deal Now</button>
            </div>
            
            <div className="banner-img-container">
              <img src={banner.img} alt="AgriMart Offer" style={{ transition: '0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BiggestDeals;