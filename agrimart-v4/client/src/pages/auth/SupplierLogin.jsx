import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SupplierLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', form);

      // ✅ FIX: Saare zaruri keys store karo jo SupplierHome/Inventory padh rahe hain
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('activeUserEmail', data.email);           // ✅ Inventory padhta hai
      localStorage.setItem('userCategory', data.userCategory || ''); // ✅ isDealer check
      localStorage.setItem(`isVerified_${data.email}`, String(data.isVerified)); // ✅ Dealer gate

      toast.success(`Welcome, ${data.name}!`);
      if (data.role === 'admin') navigate('/admin-dashboard/home');
      else navigate('/supplier-dashboard/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <svg width="42" height="42" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" fill="#1b5e20" stroke="#4caf50" strokeWidth="2"/>
            <ellipse cx="26" cy="26" rx="10" ry="22" stroke="#a5d6a7" strokeWidth="1.5" fill="none"/>
            <ellipse cx="26" cy="26" rx="22" ry="10" stroke="#a5d6a7" strokeWidth="1.5" fill="none"/>
            <path d="M16 34 Q20 24 26 18 Q32 24 36 34" stroke="#66bb6a" strokeWidth="2" fill="none"/>
            <circle cx="26" cy="18" r="3" fill="#81c784"/>
          </svg>
          <div>
            <div style={s.logoTitle}>SELLER / FARMER PORTAL</div>
            <div style={s.logoSub}>Agri-Tech-Solution — SEMENA Hybrid Seeds</div>
          </div>
        </div>
        <form onSubmit={handleLogin} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Registered Email</label>
            <input style={s.input} type="email" placeholder="registered@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div style={s.note}>ℹ Dealer accounts require admin approval before first login.</div>
          <button type="submit" style={{...s.btn, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? 'Signing In...' : 'SIGN IN TO SELLER PORTAL'}
          </button>
        </form>
        <div style={s.footer}>
          <span>Not registered yet? <Link to="/supplier-signup" style={s.link}>Register as Seller/Farmer</Link></span>
          <span>Customer? <Link to="/login" style={s.link}>Customer Login</Link></span>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', width: '100%', maxWidth: '440px', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #1a3a1a, #2e7d32)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '3px solid #ff9800' },
  logoTitle: { color: '#fff', fontWeight: '900', fontSize: '15px', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' },
  logoSub: { color: '#a5d6a7', fontSize: '12px', marginTop: '2px', fontFamily: 'Outfit, sans-serif' },
  form: { padding: '28px 32px' },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #c8e6c9', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' },
  note: { background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '10px 14px', color: '#f57f17', fontSize: '12px', marginBottom: '16px' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif', transition: 'opacity 0.2s' },
  footer: { padding: '0 32px 24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#666', fontFamily: 'Outfit, sans-serif' },
  link: { color: '#2e7d32', fontWeight: '700', textDecoration: 'none' },
};

export default SupplierLogin;
