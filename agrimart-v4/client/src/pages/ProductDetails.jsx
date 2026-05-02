import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Footer from '../components/Footer';
import '../styles/ProductDetails.css';

const API = 'http://localhost:5000';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImg, setMainImg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // ✅ FIX: Fetch from API using MongoDB _id
      const { data } = await axios.get(`${API}/api/products/${id}`);
      setProduct(data);
      setMainImg(data.image || '');

      // Fetch related products same category
      const { data: all } = await axios.get(`${API}/api/products?status=Live`);
      const related = all
        .filter(p => p.category === data.category && (p._id || p.id) !== id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error('Product fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#2e7d32' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌾</div>
        <p style={{ fontSize: '16px', fontWeight: 600 }}>Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '50px' }}>😕</div>
        <h2>Product not found!</h2>
        <button onClick={() => navigate('/')} style={{
          marginTop: '16px', padding: '10px 24px', background: '#2e7d32',
          color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
        }}>Go Home</button>
      </div>
    </div>
  );

  const productId = product._id || product.id;
  const isInCart = cart.some(item => (item._id || item.id) === productId);
  const discountPct = product.discount || (product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
  const isOutOfStock = product.countInStock === 0 || product.stock === 0;
  const isLicensed = product.productType === 'licensed';

  return (
    <div className="pd-page-root">
      <main className="pd-main-container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#2e7d32' }}>Home</span>
          {' / '}
          <span onClick={() => navigate(`/marketplace?category=${product.category}`)}
            style={{ cursor: 'pointer', color: '#2e7d32' }}>{product.category}</span>
          {' / '}
          <b>{product.name}</b>
        </nav>

        <div className="pd-grid-wrapper">
          {/* LEFT: Image */}
          <div className="pd-left-gallery">
            <div className="pd-sticky-image" style={{ position: 'relative' }}>
              <img
                src={mainImg || product.image || 'https://placehold.co/500x400/e8f5e9/2e7d32?text=AgriMart'}
                alt={product.name}
                onError={e => { e.target.src = 'https://placehold.co/500x400/e8f5e9/2e7d32?text=AgriMart'; }}
                style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
              />
              {discountPct > 0 && (
                <div className="pd-discount-badge">{discountPct}% OFF</div>
              )}
              {isOutOfStock && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px'
                }}>
                  <span style={{
                    background: '#c0392b', color: '#fff', padding: '10px 24px',
                    borderRadius: '30px', fontWeight: 800, fontSize: '18px', transform: 'rotate(-10deg)'
                  }}>SOLD OUT</span>
                </div>
              )}
            </div>

            {/* Type badge */}
            <div style={{
              marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap'
            }}>
              <span style={{
                background: isLicensed ? '#e3f2fd' : '#e8f5e9',
                color: isLicensed ? '#1565c0' : '#2e7d32',
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600
              }}>
                {isLicensed ? '🏷️ Licensed Product' : '🌿 Fresh Produce'}
              </span>
              <span style={{
                background: product.status === 'Live' ? '#e8f5e9' : '#fff3e0',
                color: product.status === 'Live' ? '#2e7d32' : '#e67e22',
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600
              }}>
                ● {product.status || 'Live'}
              </span>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="pd-right-content">
            <div className="pd-info-card">
              <span className="pd-badge">{product.category}</span>
              <h1 className="pd-title">{product.name}</h1>
              <p className="pd-vendor">
                Seller: <span style={{ color: '#2e7d32', fontWeight: 600 }}>
                  {product.brand || product.sellerName || 'AgriMart Verified Seller'}
                </span>
              </p>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                <div style={{ color: '#f39c12', fontSize: '18px' }}>
                  {'★'.repeat(Math.round(product.rating || 4))}{'☆'.repeat(5 - Math.round(product.rating || 4))}
                </div>
                <span style={{ fontSize: '13px', color: '#777' }}>
                  {product.rating || '4.0'} ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price Block */}
              <div className="pd-price-block" style={{ margin: '16px 0' }}>
                <span className="pd-current-price" style={{ fontSize: '32px', fontWeight: 800, color: '#2e7d32' }}>
                  ₹{product.price}
                </span>
                {product.oldPrice > product.price && (
                  <>
                    <span className="pd-old-price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '20px', marginLeft: '10px' }}>
                      ₹{product.oldPrice}
                    </span>
                    <span style={{
                      background: '#ff6b35', color: '#fff', padding: '3px 10px',
                      borderRadius: '4px', fontSize: '14px', fontWeight: 700, marginLeft: '10px'
                    }}>{discountPct}% OFF</span>
                  </>
                )}
              </div>
              {product.oldPrice > product.price && (
                <p style={{ color: '#27ae60', fontWeight: 600, fontSize: '14px' }}>
                  ✅ You save ₹{product.oldPrice - product.price}
                </p>
              )}

              {/* Stock Info */}
              <p style={{
                fontSize: '14px', fontWeight: 600, margin: '10px 0',
                color: isOutOfStock ? '#c0392b' : '#27ae60'
              }}>
                {isOutOfStock
                  ? '❌ Out of Stock'
                  : `✅ In Stock (${product.countInStock || product.stock} units available)`}
              </p>

              {/* Dealer-specific info */}
              {isLicensed && product.chemicalInfo && (
                <div style={{
                  background: '#f0f4ff', border: '1px solid #c5cae9', borderRadius: '10px',
                  padding: '14px', margin: '14px 0'
                }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#3949ab', fontSize: '14px' }}>
                    🔬 Batch No: {product.chemicalInfo}
                  </p>
                  {product.expiryDate && (
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#555' }}>
                      📅 Expiry: {product.expiryDate}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="pd-description" style={{ margin: '16px 0' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '8px', color: '#2d3436' }}>Product Details</h3>
                <p style={{ color: '#555', lineHeight: 1.7 }}>
                  {product.description || 'Premium quality agricultural product specially curated for high yield and farm efficiency.'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="pd-action-group" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  className={`pd-btn-cart ${isInCart ? 'pd-active' : ''}`}
                  onClick={() => {
                    if (!isInCart && !isOutOfStock) addToCart({ ...product, id: productId });
                    else if (isInCart) navigate('/cart');
                  }}
                  disabled={isOutOfStock && !isInCart}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: '15px',
                    background: isOutOfStock ? '#ccc' : (isInCart ? '#ff9800' : '#2e7d32'),
                    color: '#fff'
                  }}
                >
                  {isOutOfStock ? 'Out of Stock' : isInCart ? '→ Go to Cart' : 'Add to Cart'}
                </button>
                {!isOutOfStock && (
                  <button
                    className="pd-btn-buy"
                    onClick={() => {
                      if (!isInCart) addToCart({ ...product, id: productId });
                      navigate('/checkout');
                    }}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '8px',
                      border: '2px solid #fb641b', fontWeight: 700, fontSize: '15px',
                      background: '#fb641b', color: '#fff', cursor: 'pointer'
                    }}
                  >
                    Buy Now ⚡
                  </button>
                )}
              </div>

              {/* Trust Icons */}
              <div className="pd-trust-grid" style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '20px'
              }}>
                {[
                  { icon: '📦', text: 'Secure Packing' },
                  { icon: '🚀', text: '2-Day Delivery' },
                  { icon: '🛡️', text: 'Genuine Item' },
                ].map((t, i) => (
                  <div key={i} className="pd-trust-item" style={{
                    textAlign: 'center', padding: '10px', background: '#f9f9f9',
                    borderRadius: '8px', fontSize: '13px'
                  }}>
                    <div style={{ fontSize: '22px' }}>{t.icon}</div>
                    <span style={{ fontWeight: 600 }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '50px', padding: '0 10px' }}>
            <h2 style={{
              fontSize: '24px', fontWeight: 800, marginBottom: '24px',
              borderLeft: '5px solid #2e7d32', paddingLeft: '16px'
            }}>Similar Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {relatedProducts.map(p => {
                const pid = p._id || p.id;
                return (
                  <div key={pid}
                    onClick={() => { navigate(`/product/${pid}`); window.scrollTo(0, 0); }}
                    style={{
                      cursor: 'pointer', background: '#fff', borderRadius: '12px',
                      overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s', border: '1px solid #f0f0f0'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img src={p.image || 'https://placehold.co/300x180/e8f5e9/2e7d32?text=AgriMart'}
                      alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://placehold.co/300x180/e8f5e9/2e7d32?text=AgriMart'; }}
                    />
                    <div style={{ padding: '12px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#2d3436' }}>{p.name}</p>
                      <p style={{ fontSize: '15px', color: '#2e7d32', fontWeight: 800 }}>₹{p.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
