import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// ✅ Setup global axios defaults
axios.defaults.withCredentials = true;

const SupplierSignup = () => {
  const [category, setCategory] = useState('Farmer');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', licenceNo: '', password: '', confirmPassword: '', businessName: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
    if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) errs.password = 'Password must include a capital letter and a number.';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    
    // License check for both Equipment and Chemicals
    if ((category === 'Pesticide/Fertilizer' || category === 'Equipment') && !formData.licenceNo.trim()) {
       if (category === 'Pesticide/Fertilizer') errs.licenceNo = 'Licence number is mandatory for dealers.';
    }
    return errs;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const roleMap = { Farmer: 'farmer', Equipment: 'dealer', 'Pesticide/Fertilizer': 'dealer' };
    
    try {
      // ✅ Using full URL to match your backend CORS
      const { data } = await axios.post('http://localhost:5000/api/users/register-supplier', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: roleMap[category],
        businessName: formData.businessName,
        licenceNo: formData.licenceNo,
        userCategory: category,
      });

      toast.success(data.message || 'Registration successful!');
      // Dealers have to wait for admin approval
      if (roleMap[category] === 'dealer') {
        toast('Your account is pending admin approval.', { icon: '⏳' });
      }
      navigate('/supplier-login');
    } catch (err) {
      // ✅ Better error logging
      console.error("Signup Error Context:", err.response?.data || err.message);
      const msg = err.response?.data?.message || 'Registration failed. Check server connection.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (hasError) => ({
    width: '100%',
    padding: '11px 14px',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: hasError ? '#f44336' : '#c8e6c9',
    borderRadius: '7px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.logoRow}>
            <svg width="38" height="38" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" fill="#1b5e20" stroke="#4caf50" strokeWidth="2"/>
              <ellipse cx="26" cy="26" rx="10" ry="22" stroke="#a5d6a7" strokeWidth="1.5" fill="none"/>
              <ellipse cx="26" cy="26" rx="22" ry="10" stroke="#a5d6a7" strokeWidth="1.5" fill="none"/>
              <path d="M16 34 Q20 24 26 18 Q32 24 36 34" stroke="#66bb6a" strokeWidth="2" fill="none"/>
              <circle cx="26" cy="18" r="3" fill="#81c784"/>
            </svg>
            <div>
              <div style={styles.logoTitle}>SEMENA HYBRID SEEDS</div>
              <div style={styles.logoSub}>Agri-Tech-Solution — Seller Registration</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSignup} style={styles.form} noValidate>
          <div style={styles.field}>
            <label style={styles.label}>Business Category *</label>
            <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Farmer">Farmer (Vegetables, Fruits, Crops)</option>
              <option value="Equipment">Tools & Machinery Dealer</option>
              <option value="Pesticide/Fertilizer">Pesticides & Fertilizers Dealer (Licence Required)</option>
            </select>
          </div>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name / Entity Name *</label>
              <input style={getInputStyle(!!errors.fullName)}
                type="text" placeholder="John Agro Services"
                value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              {errors.fullName && <span style={styles.err}>{errors.fullName}</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Business Name (optional)</label>
              <input style={getInputStyle(false)} type="text" placeholder="Business / Farm Name"
                value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address *</label>
            <input style={getInputStyle(!!errors.email)}
              type="email" placeholder="you@example.com"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            {errors.email && <span style={styles.err}>{errors.email}</span>}
          </div>

          {(category === 'Pesticide/Fertilizer' || category === 'Equipment') && (
            <div style={styles.field}>
              <label style={styles.label}>Government Licence Number {category === 'Pesticide/Fertilizer' ? '*' : '(if available)'}</label>
              <input style={getInputStyle(!!errors.licenceNo)}
                type="text" placeholder="e.g. MH/PEST/2024/00123"
                value={formData.licenceNo} onChange={e => setFormData({...formData, licenceNo: e.target.value})} />
              {errors.licenceNo && <span style={styles.err}>{errors.licenceNo}</span>}
              {category === 'Pesticide/Fertilizer' && (
                <span style={styles.hint}>⚠ Dealers require admin approval before account activation.</span>
              )}
            </div>
          )}

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Password *</label>
              <input style={getInputStyle(!!errors.password)}
                type="password" placeholder="Min 8 chars, 1 capital, 1 number"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              {errors.password && <span style={styles.err}>{errors.password}</span>}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password *</label>
              <input style={getInputStyle(!!errors.confirmPassword)}
                type="password" placeholder="Re-enter password"
                value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              {errors.confirmPassword && <span style={styles.err}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" style={{...styles.btn, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? 'Registering...' : 'REGISTER AS SELLER / FARMER'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/supplier-login" style={styles.link}>Sign in here</Link>
          {' · '}
          <Link to="/login" style={styles.link}>Customer Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { background: '#fff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', width: '100%', maxWidth: '700px', overflow: 'hidden' },
  cardHeader: { background: 'linear-gradient(135deg, #1a3a1a, #2e7d32)', padding: '24px 32px', borderBottom: '3px solid #ff9800' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoTitle: { color: '#fff', fontWeight: '900', fontSize: '15px', letterSpacing: '1px' },
  logoSub: { color: '#a5d6a7', fontSize: '12px', marginTop: '2px' },
  form: { padding: '28px 32px' },
  field: { marginBottom: '18px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#2e7d32', marginBottom: '6px' },
  select: { width: '100%', padding: '11px 14px', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#c8e6c9', borderRadius: '7px', fontSize: '14px', outline: 'none', fontFamily: 'Outfit, sans-serif', background: '#fff', boxSizing: 'border-box' },
  err: { color: '#f44336', fontSize: '12px', marginTop: '4px', display: 'block' },
  hint: { color: '#ff9800', fontSize: '12px', marginTop: '4px', display: 'block' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif', transition: 'opacity 0.2s' },
  footer: { textAlign: 'center', padding: '16px 32px 24px', fontSize: '13px', color: '#666' },
  link: { color: '#2e7d32', fontWeight: '700', textDecoration: 'none' },
};

export default SupplierSignup;