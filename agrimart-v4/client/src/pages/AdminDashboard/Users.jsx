import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../../styles/AdminDashboard/AdminHome.css';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // 1. Pehle saare registered users uthao (Signup se jo store hue hain)
    // Maan le tere signup ka key 'users' hai
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setAllUsers(users);
  }, []);

  // --- Status Toggle Logic (Specific for Dealers) ---
  const toggleDealerStatus = (email, currentStatus) => {
    const newStatus = !currentStatus;
    localStorage.setItem(`isVerified_${email}`, newStatus.toString());
    
    // UI update ke liye page refresh ya state update
    toast.success(`Dealer status updated to: ${newStatus ? 'Verified' : 'Pending'}`);
    window.location.reload(); // Simple refresh to reflect changes from localStorage
  };

  // --- FILTER LOGIC ---
  const filteredUsers = allUsers.filter(u => {
    if (filter === 'All') return true;
    if (filter === 'Dealer') return u.userCategory === 'Pesticide/Fertilizer';
    if (filter === 'Farmer') return u.userCategory === 'Farmer';
    if (filter === 'Customer') return u.userCategory === 'Customer';
    return true;
  });

  return (
    <div className="users-admin-view">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3>👥 Registered Users Directory</h3>
        
        {/* Filter Buttons */}
        <div className="filter-group">
          {['All', 'Farmer', 'Dealer', 'Customer'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)} 
              className={filter === f ? 'active-filter' : ''}
              style={{ padding: '8px 15px', margin: '0 5px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              {f}s
            </button>
          ))}
        </div>
      </div>

      <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Name & Email</th>
            <th>Category</th>
            <th>Verification Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? filteredUsers.map(user => {
            const isVerified = localStorage.getItem(`isVerified_${user.email}`) === 'true';
            const isADealer = user.userCategory === 'Pesticide/Fertilizer';

            return (
              <tr key={user.email} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  <strong>{user.fullName || user.name}</strong> <br />
                  <small>{user.email}</small>
                </td>
                <td>
                  <span className={`role-tag ${user.userCategory}`}>
                    {isADealer ? 'Dealer' : user.userCategory}
                  </span>
                </td>
                <td>
                  {isADealer ? (
                    <span style={{ 
                      color: isVerified ? '#2e7d32' : '#d35400', 
                      fontWeight: 'bold',
                      background: isVerified ? '#e8f5e9' : '#fff3e0',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {isVerified ? '● Verified' : '● Pending'}
                    </span>
                  ) : (
                    <span style={{ color: '#2980b9' }}>● Active</span>
                  )}
                </td>
                <td>
                  {isADealer && (
                    <button 
                      onClick={() => toggleDealerStatus(user.email, isVerified)}
                      style={{ 
                        padding: '5px 10px', 
                        fontSize: '11px',
                        cursor: 'pointer',
                        background: isVerified ? '#ff7675' : '#55efc4',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      {isVerified ? 'Revoke Access' : 'Verify Dealer'}
                    </button>
                  )}
                  {!isADealer && <small style={{ color: '#999' }}>No Action Needed</small>}
                </td>
              </tr>
            );
          }) : (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;