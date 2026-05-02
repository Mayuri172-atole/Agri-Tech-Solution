import React from 'react';
import '../styles/ProductCard.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

const ProductCard = ({ product }) => {
  const { addToCart, cart, wishlist, moveToWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  // ✅ FIX 1: MongoDB uses _id, local data uses id — support both
  const productId = product._id || product.id;

  const isAlreadyInCart = cart.some((item) => (item._id || item.id) === productId);
  const isWishlisted = wishlist.some((item) => (item._id || item.id) === productId);
  const isOutOfStock = (product.countInStock === 0 || product.stock === 0);

  const discountPct = product.discount || (product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0);

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('.wishlist-icon')) return;
    // ✅ FIX 2: Navigate using _id (MongoDB id)
    navigate(`/product/${productId}`);
  };

  const handleDirectBuy = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!isAlreadyInCart) addToCart({ ...product, id: productId });
    navigate('/checkout');
  };

  return (
    <div
      className="product-card"
      style={{ position: 'relative', cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      {/* Discount Badge */}
      {discountPct > 0 && (
        <div className="discount-badge">{discountPct}% OFF</div>
      )}

      {/* Tag Badge (Trending Now, etc.) */}
      {product.tag && (
        <div className="tag-line">{product.tag}</div>
      )}

      {/* Wishlist Icon */}
      <div
        className="wishlist-icon"
        onClick={(e) => {
          e.stopPropagation();
          isWishlisted
            ? removeFromWishlist(productId)
            : moveToWishlist({ ...product, id: productId });
        }}
        style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 2,
          cursor: 'pointer', color: isWishlisted ? '#ff5252' : '#666',
          background: '#fff', borderRadius: '50%', padding: '4px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
        }}
      >
        {isWishlisted ? <HiHeart size={22} /> : <HiOutlineHeart size={22} />}
      </div>

      {/* Product Image */}
      <div className="img-container">
        <img
          src={product.image || product.img || 'https://placehold.co/300x200/e8f5e9/2e7d32?text=AgriMart'}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://placehold.co/300x200/e8f5e9/2e7d32?text=AgriMart'; }}
        />
        {isOutOfStock && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '10px 10px 0 0'
          }}>
            <span style={{
              background: '#c0392b', color: '#fff', padding: '6px 14px',
              borderRadius: '20px', fontWeight: 700, fontSize: '13px', transform: 'rotate(-15deg)'
            }}>SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="product-info">
        {/* Category Tag */}
        <span style={{
          fontSize: '11px', color: '#2e7d32', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>{product.category}</span>

        <h3 className="product-name">{product.name}</h3>
        <p className="brand-name">{product.brand || product.sellerName || 'AgriMart Verified'}</p>

        <div className="price-row">
          <span className="current-price">₹{product.price}</span>
          {product.oldPrice > product.price && (
            <span className="old-price">₹{product.oldPrice}</span>
          )}
        </div>

        {product.oldPrice > product.price && (
          <div className="save-label">● Save ₹{product.oldPrice - product.price}</div>
        )}

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            className={`add-to-cart-btn ${isAlreadyInCart ? 'go-to-cart' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              isAlreadyInCart ? navigate('/cart') : addToCart({ ...product, id: productId });
            }}
            disabled={isOutOfStock}
            style={{
              width: '100%', padding: '10px', borderRadius: '6px', border: 'none',
              fontWeight: 'bold', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              backgroundColor: isOutOfStock ? '#ccc' : (isAlreadyInCart ? '#ff9800' : '#2e7d32'),
              color: '#fff', transition: '0.2s'
            }}
          >
            {isOutOfStock ? 'Out of Stock' : (isAlreadyInCart ? '→ Go to Cart' : 'Add to Cart')}
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleDirectBuy}
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1.5px solid #fb641b', fontWeight: 'bold', cursor: 'pointer',
                backgroundColor: '#fff', color: '#fb641b', transition: '0.2s'
              }}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
