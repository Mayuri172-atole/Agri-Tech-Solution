import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiStar, HiOutlineShoppingBag } from 'react-icons/hi';
import '../styles/sections/FeaturedProducts.css';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  // 1. Static Top Sellers (Fallback jab tak backend khali hai)
  const staticFeatured = [
    { id: 101, name: "NPK 19:19:19 Fertilizer", price: 450, oPrice: 600, rating: 4.8, img: "https://i.ibb.co/N2L8XmG/nutrients.png", tag: "Best Seller" },
    { id: 102, name: "Hybrid Tomato Seeds", price: 150, oPrice: 200, rating: 4.5, img: "https://i.ibb.co/KzsLz9v/veg-seeds.png", tag: "Popular" },
    { id: 103, name: "Organic Neem Oil", price: 320, oPrice: 400, rating: 4.9, img: "https://i.ibb.co/r7Y8S6t/insecticides.png", tag: "Organic" },
    { id: 104, name: "Power Sprayer 16L", price: 2800, oPrice: 3500, rating: 4.7, img: "https://i.ibb.co/YyYh5zP/machinery.png", tag: "Top Rated" },
  ];

  useEffect(() => {
    const fetchFeatured = () => {
      // 2. LocalStorage se wo products uthao jo "Featured" hain
      const storedItems = JSON.parse(localStorage.getItem('all_products') || '[]');
      
      const dynamicFeatured = storedItems
        .filter(item => item.isFeatured === true && item.status === 'Live')
        .map(item => ({
          ...item,
          img: item.image || item.img,
          oPrice: item.originalPrice || item.price,
          tag: item.tag || "Featured",
          rating: item.rating || 4.5 // Default rating agar admin ne nahi dali
        }));

      // Merge: Dynamic wala pehle dikhao
      setFeatured([...dynamicFeatured, ...staticFeatured].slice(0, 4)); // Sirf Top 4 dikhao
    };

    fetchFeatured();
    window.addEventListener('storage', fetchFeatured);
    return () => window.removeEventListener('storage', fetchFeatured);
  }, []);

  return (
    <section className="fp-section">
      <div className="fp-container">
        <div className="fp-header">
          <h2 className="fp-title">Trending Now 🔥</h2>
          <p className="fp-subtitle">Trusted by 10,000+ Farmers</p>
        </div>

        <div className="fp-grid">
          {featured.map((prod) => (
            <div key={prod.id} className="fp-card" onClick={() => navigate(`/product/${prod.id}`)}>
              <div className="fp-badge">{prod.tag}</div>
              
              <div className="fp-img-hold">
                <img src={prod.img} alt={prod.name} />
              </div>

              <div className="fp-info">
                <div className="fp-rating">
                  <HiStar className="star-icon" /> <span>{prod.rating}</span>
                </div>
                <h3 className="fp-name">{prod.name}</h3>
                
                <div className="fp-price-row">
                  <div className="fp-prices">
                    <span className="fp-now">₹{Number(prod.price).toLocaleString()}</span>
                    {Number(prod.oPrice) > Number(prod.price) && (
                      <span className="fp-old">₹{Number(prod.oPrice).toLocaleString()}</span>
                    )}
                  </div>
                  <button 
                    className="fp-add-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Card click event ko rokne ke liye
                      // Add to cart logic yahan aayega
                    }}
                  >
                    <HiOutlineShoppingBag />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;