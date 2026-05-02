import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../styles/AllCrops.css';

const API = 'http://localhost:5000';

const AllCrops = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const params = new URLSearchParams(location.search);
  const categoryParam = params.get('category');
  const typeParam     = params.get('type');
  const searchParam   = params.get('search') || '';

  useEffect(() => {
    setSearchInput(searchParam);
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ status: 'Live' });
      if (categoryParam) q.append('category', categoryParam);
      if (typeParam)     q.append('type', typeParam);

      const { data } = await axios.get(`${API}/api/products?${q}`);

      // Apply search filter client-side
      let result = data;
      if (searchParam) {
        result = data.filter(p =>
          p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(searchParam.toLowerCase())
        );
      }
      setProducts(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/marketplace?search=${encodeURIComponent(searchInput)}`);
  };

  const pageTitle = searchParam
    ? `Results for "${searchParam}"`
    : categoryParam
    ? `${categoryParam} Products`
    : typeParam === 'fresh'
    ? '🌿 Fresh Farm Produce'
    : typeParam === 'licensed'
    ? '🏷️ Licensed Agri-Inputs'
    : '🛒 All Products';

  return (
    <div className="all-crops-page">
      <div className="crops-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#2e7d32', fontWeight: 600, fontSize: '14px'
            }}>← Back</button>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800 }}>{pageTitle}</h1>
            {!loading && (
              <span style={{
                background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px',
                borderRadius: '20px', fontSize: '13px', fontWeight: 600
              }}>{products.length} products</span>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ marginTop: '16px', display: 'flex', gap: '10px', maxWidth: '500px' }}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products..."
              style={{
                flex: 1, padding: '11px 16px', border: '1.5px solid #ddd',
                borderRadius: '8px', fontSize: '15px', outline: 'none'
              }}
            />
            <button type="submit" style={{
              padding: '11px 20px', background: '#2e7d32', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
            }}>Search</button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['All', 'Vegetables', 'Fruits', 'Grains', 'Pesticide', 'Fertilizer', 'Seeds', 'Tools'].map(cat => (
            <button
              key={cat}
              onClick={() => navigate(cat === 'All' ? '/marketplace' : `/marketplace?category=${cat}`)}
              style={{
                padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
                border: '1.5px solid',
                borderColor: categoryParam === cat ? '#2e7d32' : '#ddd',
                background: categoryParam === cat ? '#2e7d32' : '#fff',
                color: categoryParam === cat ? '#fff' : '#555',
                fontWeight: 600, fontSize: '13px', transition: '0.2s'
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#2e7d32' }}>
            <div style={{ fontSize: '40px' }}>🌱</div>
            <p style={{ fontWeight: 600, marginTop: '12px' }}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '50px' }}>😕</div>
            <h3 style={{ marginTop: '12px' }}>No products found</h3>
            <p>Try a different category or search term</p>
            <button onClick={() => navigate('/')} style={{
              marginTop: '16px', padding: '10px 24px', background: '#2e7d32',
              color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
            }}>Go Home</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px'
          }}>
            {products.map(p => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCrops;
