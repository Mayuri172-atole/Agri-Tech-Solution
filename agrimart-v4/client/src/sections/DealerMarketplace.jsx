import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import '../styles/sections/DealsSection.css';

const API = 'http://localhost:5000';

const DealerMarketplace = ({ type, title, subtitle, category, limit }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [type, category]);

  const fetchData = async () => {
    try {
      // ✅ FIX: Build query params correctly — only fetch Live products
      const params = new URLSearchParams({ status: 'Live' });
      if (type) params.append('type', type);
      if (category) params.append('category', category);

      const { data } = await axios.get(`${API}/api/products?${params}`);
      const result = limit ? data.slice(0, limit) : data;
      setProducts(result);
    } catch (err) {
      console.error('Fetch failed:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // View all route
  const viewAllRoute = () => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    navigate(`/marketplace?${params}`);
  };

  if (isLoading) {
    return (
      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ color: '#2e7d32', fontWeight: 600, fontSize: '16px' }}>
          <span style={{ fontSize: '28px' }}>🌿</span><br />Loading {title}...
        </div>
      </section>
    );
  }

  if (products.length === 0) return null; // Don't show empty sections

  return (
    <section
      className="dealer-market-section"
      style={{
        padding: '40px 20px',
        background: type === 'fresh' ? '#f4fbf4' : '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '28px', borderLeft: '5px solid #2e7d32', paddingLeft: '18px'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#2d3436' }}>
              {title}
            </h2>
            <p style={{ color: '#636e72', fontSize: '14px', marginTop: '6px' }}>{subtitle}</p>
          </div>
          <button
            onClick={viewAllRoute}
            style={{
              background: 'none', border: '1.5px solid #2e7d32', color: '#2e7d32',
              padding: '8px 18px', borderRadius: '20px', cursor: 'pointer',
              fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap'
            }}
          >
            View All →
          </button>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '20px'
        }}>
          {products.map((item) => (
            <ProductCard key={item._id || item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealerMarketplace;
