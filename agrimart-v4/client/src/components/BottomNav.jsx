import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi';

const BottomNav = () => {
  return (
    <div className="mobile-bottom-nav">
      <Link to="/">
        <HiOutlineHome />
        <span>Home</span>
      </Link>
      <Link to="/marketplace">
        <HiOutlineSearch />
        <span>Search</span>
      </Link>
      <Link to="/cart">
        <HiOutlineShoppingBag />
        <span>Cart</span>
      </Link>
      <Link to="/customer-dashboard">
        <HiOutlineUser />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;