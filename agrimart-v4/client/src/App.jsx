import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Wishlist from './pages/Wishlist';
import Checkout from './components/Checkout';
import Cart from './pages/Cart';
import AllCrops from './pages/AllCrops';
import Marketplace from './sections/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

// AI & Feature Pages
import CropHealth from './pages/CropHealth';
import AgriBot from './pages/AgriBot';
import AgriTube from './pages/AgriTube';
import DeliveryPanel from './pages/DeliveryPanel';
import Profile from './pages/Profile';

// Auth
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerSignup from './pages/auth/CustomerSignup';
import SupplierLogin from './pages/auth/SupplierLogin';
import SupplierSignup from './pages/auth/SupplierSignup';
import AdminLogin from './pages/auth/AdminLogin';

// Dashboards
import AdminHome from './pages/AdminDashboard/AdminHome';
import SupplierHome from './pages/SupplierDashboard/SupplierHome';
import Inventory from './pages/SupplierDashboard/Inventory';
import CustomerHome from './pages/CustomerDashboard/CustomerHome';

function App() {
  return (
    <LanguageProvider>
    <CartProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '8px', fontFamily: 'Outfit, sans-serif', fontWeight: '600' } }} />
        <Navbar />
        {/* Offset for fixed navbar: company band (~70px) + main nav (~70px) + category nav (~43px) = ~183px */}
        <div className="main-content-layout" style={{ marginTop: '183px', minHeight: '100vh' }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/all-crops" element={<AllCrops />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* AI Features */}
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/agribot" element={<AgriBot />} />
            <Route path="/agritube" element={<AgriTube />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Delivery */}
            <Route path="/delivery-panel" element={<DeliveryPanel />} />

            {/* Auth */}
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/signup" element={<CustomerSignup />} />
            <Route path="/auth/CustomerSignup" element={<CustomerSignup />} />
            <Route path="/customer-dashboard" element={<CustomerHome />} />

            <Route path="/supplier-login" element={<SupplierLogin />} />
            <Route path="/supplier-signup" element={<SupplierSignup />} />
            <Route path="/supplier-dashboard/home" element={<SupplierHome />} />
            <Route path="/supplier-dashboard/inventory" element={<Inventory />} />
            <Route path="/supplier-dashboard/orders" element={<div style={{ padding: '60px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}><h2>Orders — Coming Soon</h2></div>} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/admin-dashboard/home" element={<AdminHome />} />
          </Routes>
        </div>
        <BottomNav />
      </Router>
    </CartProvider>
    </LanguageProvider>
  );
}

export default App;
