import React, { useState, useEffect } from 'react';
import '../../styles/SupplierDashboard/SupplierHome.css'; 

const SupplierLedger = () => {
  const [myStock, setMyStock] = useState([]);
  const email = localStorage.getItem('activeUserEmail');
  const userCategory = localStorage.getItem('userCategory');
  const isDealer = userCategory === 'Pesticide/Fertilizer';

  useEffect(() => {
    // 1. Maal uthao (Farmer ka ya Dealer ka)
    const key = isDealer ? 'approvedProducts' : 'farmerStock';
    const pendingKey = 'pendingChemicals';

    const liveItems = JSON.parse(localStorage.getItem(key) || '[]');
    const pendingItems = JSON.parse(localStorage.getItem(pendingKey) || '[]');

    // Sirf is supplier ka data filter karo
    const myLive = liveItems.filter(p => p.seller === email);
    const myPending = pendingItems.filter(p => p.seller === email);

    setMyStock([...myLive, ...myPending]);
  }, [email, isDealer]);

  return (
    <div className="ledger-container" style={{ padding: '20px' }}>
      <div className="ledger-header" style={{ marginBottom: '25px' }}>
        <h2>📋 My Business Ledger</h2>
        <p>Track your listings, sales, and approval status here.</p>
      </div>

      <div className="table-card" style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px' }}>Product Details</th>
              <th>Category</th>
              <th>Stock Qty</th>
              <th>Price (₹)</th>
              <th>Status</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {myStock.length > 0 ? myStock.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>
                  <strong>{item.name}</strong> <br/>
                  <small style={{ color: '#636e72' }}>ID: #{item.id.toString().slice(-5)}</small>
                </td>
                <td>{item.category}</td>
                <td>{item.stock}</td>
                <td>₹{item.price}</td>
                <td>
                  <span className={`status-badge`} style={{ 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    background: item.status === 'Live' ? '#e8f5e9' : '#fff3e0',
                    color: item.status === 'Live' ? '#2e7d32' : '#d35400',
                    fontWeight: 'bold'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ fontWeight: 'bold', color: '#2980b9' }}>
                  {item.soldCount || 0} Sold
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  Koi record nahi mila, Bidu! Pehle stock add kar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierLedger;