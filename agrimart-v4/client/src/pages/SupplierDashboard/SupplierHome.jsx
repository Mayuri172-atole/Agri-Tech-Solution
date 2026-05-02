import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdHistory, MdLogout, MdVerifiedUser, MdListAlt, MdPayment, MdArrowForward } from 'react-icons/md';
import SupplierLedger from './SupplierLedger';
import Inventory from './Inventory';
import '../../styles/SupplierDashboard/SupplierHome.css';

const SupplierHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState({ name: 'Supplier', category: 'Farmer', role: 'farmer', isVerified: false });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/supplier-login'); return; }

    // ✅ Fetch from DB instead of localStorage
    fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setUserData({
          name: data.name,
          category: data.userCategory || 'Farmer',
          role: data.role,
          isVerified: data.isVerified
        });
        // ✅ Update localStorage too for Inventory.jsx
        localStorage.setItem('activeUserEmail', data.email);
        localStorage.setItem('userCategory', data.userCategory || '');
        localStorage.setItem('userName', data.name);
        localStorage.setItem(`isVerified_${data.email}`, String(data.isVerified));
      })
      .catch(() => navigate('/supplier-login'));
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // ✅ Role based checks
  const isDealer   = userData.role === 'dealer' && userData.category === 'Pesticide/Fertilizer';
  const isTooler   = userData.role === 'dealer' && userData.category === 'Equipment';
  const isFarmer   = userData.role === 'farmer';

  const getDashboardLabel = () => {
    if (isDealer) return '🧪 Dealer';
    if (isTooler) return '🔧 Equipment Dealer';
    return '🚜 Farmer';
  };

  const getAddLabel = () => {
    if (isDealer) return 'Add Chemical/Fertilizer';
    if (isTooler) return 'Add Equipment/Tools';
    return 'Add Crop/Produce';
  };

  return (
    <div className="supplier-container">
      <aside className="supplier-sidebar">
        <div className="sidebar-logo">AgriMart {getDashboardLabel()}</div>
        <nav>
          <div className={`sidebar-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <MdDashboard /> Dashboard
          </div>
          <div className={`sidebar-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <MdInventory /> {getAddLabel()}
          </div>
          <div className={`sidebar-link ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
            <MdListAlt /> My Stock & Sales
          </div>
          <div className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <MdShoppingCart /> Orders
          </div>
          <div className={`sidebar-link ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
            <MdPayment /> Payments
          </div>
        </nav>
        <button onClick={handleLogout} className="sidebar-link logout-btn"
          style={{ marginTop: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          <MdLogout /> Logout
        </button>
      </aside>

      <main className="supplier-main">
        <header className="dashboard-header">
          <div>
            <h2>Ram Ram, {userData.name} {isDealer ? '🧪' : isTooler ? '🔧' : '🚜'}</h2>
            <p>{isDealer ? 'Fertilizer & Pesticide Control' : isTooler ? 'Equipment & Tools Management' : 'Farm Fresh Produce Management'}</p>
          </div>
          <span className={`status-badge ${userData.isVerified ? 'status-live' : 'status-pending'}`}>
            {userData.isVerified ? <><MdVerifiedUser /> Verified</> : '● Pending Approval'}
          </span>
        </header>

        <section className="dynamic-content">
          {activeTab === 'home' && (
            <>
              <div className="stats-grid">
                <div className="stat-card"><p>Total Revenue</p><h3>₹54,200</h3></div>
                <div className="stat-card"><p>Active Stock Items</p><h3>24</h3></div>
                <div className="stat-card urgent"><p>Pending Orders</p><h3>08</h3></div>
              </div>
              <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Quick Actions ⚡</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div onClick={() => setActiveTab('inventory')}
                  style={{ background: '#fff', padding: '25px', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '6px solid #2ecc71' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{getAddLabel()}</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>Stock update karne ke liye yahan click karein</p>
                  </div>
                  <MdArrowForward size={24} color="#2ecc71" />
                </div>
                <div onClick={() => setActiveTab('ledger')}
                  style={{ background: '#fff', padding: '25px', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '6px solid #3498db' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>View Stock & Sales Report</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>Database aur sales history dekhne ke liye</p>
                  </div>
                  <MdArrowForward size={24} color="#3498db" />
                </div>
              </div>
            </>
          )}
          {activeTab === 'inventory' && <Inventory role={userData.role} category={userData.category} />}
          {activeTab === 'ledger' && <SupplierLedger />}
          {activeTab === 'payments' && (
            <div style={{ padding: '20px', background: '#fff', borderRadius: '15px' }}>
              <h3>💰 Payment History</h3><p>No recent payments found.</p>
            </div>
          )}
          {activeTab === 'orders' && (
            <div style={{ padding: '20px', background: '#fff', borderRadius: '15px' }}>
              <h3>📦 Manage Orders</h3><p>Check and ship your pending orders here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SupplierHome;