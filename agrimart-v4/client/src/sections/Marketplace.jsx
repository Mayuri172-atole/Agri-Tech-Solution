import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = 'http://localhost:5000';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Seeds', 'Pesticide', 'Fertilizer', 'Tools'];

const Marketplace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  const params   = new URLSearchParams(location.search);
  const category = params.get('category') || '';
  const type     = params.get('type') || '';
  const search   = params.get('search') || '';
  const sort     = params.get('sort') || 'newest';

  useEffect(() => {
    setSearchInput(search);
    fetchProducts();
    window.scrollTo(0, 0);
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ status: 'Live' });
      if (category) q.append('category', category);
      if (type)     q.append('type', type);

      const { data } = await axios.get(`${API}/api/products?${q}`);

      let result = data;
      if (search) {
        result = data.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(search.toLowerCase())
        );
      }

      // Sort
      if (sort === 'price_asc')  result = [...result].sort((a,b) => a.price - b.price);
      if (sort === 'price_desc') result = [...result].sort((a,b) => b.price - a.price);
      if (sort === 'discount')   result = [...result].sort((a,b) => (b.discount||0) - (a.discount||0));

      setProducts(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(location.search);
    if (value) p.set(key, value); else p.delete(key);
    navigate(`/marketplace?${p}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const pageTitle = search ? `Results for "${search}"`
    : category ? `${category}`
    : type === 'fresh' ? '🌿 Fresh Farm Produce'
    : type === 'licensed' ? '🏷️ Licensed Agri-Inputs'
    : '🛒 All Products';

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>

      {/* Header + Search */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2d3436', marginBottom: '16px' }}>
          {pageTitle}
          {!loading && (
            <span style={{
              fontSize: '14px', background: '#e8f5e9', color: '#2e7d32',
              padding: '4px 12px', borderRadius: '20px', marginLeft: '12px', fontWeight: 600
            }}>{products.length} products</span>
          )}
        </h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products, crops, brands..."
            style={{
              flex: 1, padding: '12px 16px', border: '1.5px solid #e0e0e0',
              borderRadius: '8px', fontSize: '15px', outline: 'none'
            }}
          />
          <button type="submit" style={{
            padding: '12px 20px', background: '#2e7d32', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700
          }}>🔍</button>
        </form>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        marginBottom: '20px', alignItems: 'center'
      }}>
        {/* Category Pills */}
        {CATEGORIES.map(cat => {
          const isActive = (cat === 'All' && !category) || category === cat;
          return (
            <button key={cat}
              onClick={() => updateFilter('category', cat === 'All' ? '' : cat)}
              style={{
                padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
                border: '1.5px solid', fontWeight: 600, fontSize: '13px', transition: '0.2s',
                borderColor: isActive ? '#2e7d32' : '#ddd',
                background: isActive ? '#2e7d32' : '#fff',
                color: isActive ? '#fff' : '#555',
              }}
            >{cat}</button>
          );
        })}

        {/* Type Toggle */}
        {['fresh', 'licensed'].map(t => (
          <button key={t}
            onClick={() => updateFilter('type', type === t ? '' : t)}
            style={{
              padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
              border: '1.5px solid', fontWeight: 600, fontSize: '13px', transition: '0.2s',
              borderColor: type === t ? '#1565c0' : '#ddd',
              background: type === t ? '#1565c0' : '#fff',
              color: type === t ? '#fff' : '#555',
            }}
          >{t === 'fresh' ? '🌿 Fresh' : '🏷️ Licensed'}</button>
        ))}

        {/* Sort */}
        <select
          value={sort}
          onChange={e => updateFilter('sort', e.target.value)}
          style={{
            marginLeft: 'auto', padding: '8px 14px', borderRadius: '8px',
            border: '1.5px solid #ddd', cursor: 'pointer', fontWeight: 600,
            fontSize: '13px', background: '#fff', outline: 'none'
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="discount">Best Discount</option>
        </select>
      </div>

      {/* Products */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#2e7d32' }}>
          <div style={{ fontSize: '50px' }}>🌱</div>
          <p style={{ fontWeight: 600, marginTop: '12px', fontSize: '16px' }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
          <div style={{ fontSize: '50px' }}>😕</div>
          <h3 style={{ marginTop: '12px' }}>No products found</h3>
          <p>Try removing filters or search with different keywords</p>
          <button onClick={() => navigate('/marketplace')} style={{
            marginTop: '16px', padding: '10px 24px', background: '#2e7d32',
            color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
          }}>Clear Filters</button>
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
  );
};

export default Marketplace;
