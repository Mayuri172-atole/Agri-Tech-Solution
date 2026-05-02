import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const CustomerSignup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (form.password.length < 8) errs.password = 'Min 8 characters.';
    if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = 'Must include a capital letter and a number.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/register-customer', { name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
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
            <div style={s.logoTitle}>AGRI-TECH-SOLUTION</div>
            <div style={s.logoSub}>Create a free customer account</div>
          </div>
        </div>
        <form onSubmit={handleSignup} style={s.form} noValidate>
          {[{key:'name',label:'Full Name',type:'text',placeholder:'Your full name'},{key:'email',label:'Email Address',type:'email',placeholder:'you@example.com'},{key:'password',label:'Password',type:'password',placeholder:'Min 8 chars, 1 capital, 1 number'},{key:'confirmPassword',label:'Confirm Password',type:'password',placeholder:'Re-enter password'}].map(f => (
            <div key={f.key} style={s.field}>
              <label style={s.label}>{f.label} *</label>
              <input style={{...s.input, ...(errors[f.key] ? s.inputErr : {})}}
                type={f.type} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} />
              {errors[f.key] && <span style={s.err}>{errors[f.key]}</span>}
            </div>
          ))}
          <button type="submit" style={{...s.btn, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <div style={s.footer}>
          <span>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></span>
          <span>Seller or Farmer? <Link to="/supplier-signup" style={s.link}>Register here</Link></span>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', width: '100%', maxWidth: '480px', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #1a3a1a, #2e7d32)', padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '3px solid #ff9800' },
  logoTitle: { color: '#fff', fontWeight: '900', fontSize: '16px', letterSpacing: '1.5px', fontFamily: 'Outfit, sans-serif' },
  logoSub: { color: '#a5d6a7', fontSize: '13px', marginTop: '2px', fontFamily: 'Outfit, sans-serif' },
  form: { padding: '28px 32px' },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #c8e6c9', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' },
  inputErr: { borderColor: '#f44336' },
  err: { display: 'block', color: '#f44336', fontSize: '12px', marginTop: '4px', fontFamily: 'Outfit, sans-serif' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif', transition: 'opacity 0.2s' },
  footer: { padding: '0 32px 24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#666', fontFamily: 'Outfit, sans-serif' },
  link: { color: '#2e7d32', fontWeight: '700', textDecoration: 'none' },
};

export default CustomerSignup;
