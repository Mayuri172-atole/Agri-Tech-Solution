import React from 'react';
import { HiOutlineSearch, HiOutlineUser, HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi';
import { MdLanguage, MdLocalShipping } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const Header = () => {
  const { cartCount } = useCart();

  return (
    <div className="header-wrapper">
      {/* Top Utility Strip */}
      <div className="top-strip">
        <div className="container">
          <div className="top-right-links">
            <div className="util-item lang">
              <MdLanguage className="green-text" /> <span>English</span> ▼
            </div>
            <div className="util-item"><MdLocalShipping /> <span>Track Order</span></div>
            <div className="util-item"><HiOutlineHeart /> <span>Wishlist</span></div>
            <div className="util-item"><HiOutlineUser /> <span>Login</span></div>
          </div>
        </div>
      </div>

      {/* Main Search Area */}
      <div className="main-header">
        <div className="container header-flex">
          <div className="logo-box">
            <img src="https://www.bighaat.com/cdn/shop/files/BigHaat_Logo_New.png" alt="BigHaat" />
          </div>

          <div className="search-box">
            <input type="text" placeholder="Search for products, brands and more" />
            <button className="search-btn"><HiOutlineSearch /></button>
          </div>

          <div className="cart-container">
            <div className="cart-icon-wrapper">
              <HiOutlineShoppingBag />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span className="cart-label">Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;