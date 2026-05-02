import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
//Email: admin@agrimart.in
//Password: Admin@2026

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (data.role !== 'admin') {
        toast.error('Ye account admin nahi hai!');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('isLoggedIn', 'true');

      toast.success('Access Granted! Welcome back, Admin.');
      navigate('/admin-dashboard/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={adminContainer}>
      <div style={adminCard}>
        <div style={redCircle}>🛡️</div>
        <h2 style={{ margin: '10px 0' }}>Admin Authentication</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Only authorized personnel beyond this point.</p>
        <form onSubmit={handleAdminAccess}>
          <input type="email" placeholder="Admin Email" required
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            style={inputStyle} />
          <input type="password" placeholder="Password" required
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            style={inputStyle} />
          <button style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Verifying...' : 'AUTHORIZE & UNLOCK'}
          </button>
        </form>
      </div>
    </div>
  );
};

const adminContainer = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' };
const adminCard = { background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' };
const redCircle = { fontSize: '40px', background: '#fee2e2', width: '70px', height: '70px', lineHeight: '70px', borderRadius: '50%', margin: '0 auto 15px' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif', fontSize: '14px' };
const btnStyle = { width: '100%', padding: '12px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', fontFamily: 'Outfit, sans-serif' };

export default AdminLogin;
