import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1100, 1320].forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    });
  } catch (e) {}
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [addr, setAddr] = useState({ house: '', street: '', city: '', state: '', pincode: '', phone: '', email: '' });
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => { if (cart.length === 0) navigate('/cart'); }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(API + '/api/users/me', { headers: { Authorization: 'Bearer ' + token } })
      .then(({ data }) => {
        setProfile(data);
        setAddr(prev => ({ ...prev, phone: data.mobile || '', email: data.email || '' }));
      }).catch(() => {});
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
  const deliveryCharge = paymentMethod === 'COD' ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!addr.house || !addr.city || !addr.pincode) { toast.error('House No, City aur Pincode required hai!'); return; }
    if (!addr.email) { toast.error('Email address required hai — confirmation mail ke liye!'); return; }
    if (paymentMethod === 'UPI' && !upiId.trim()) { toast.error('UPI ID enter karein!'); return; }
    if (paymentMethod === 'Card' && (!card.number || !card.expiry || !card.cvv)) { toast.error('Card details fill karein!'); return; }
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Login karein pehle!'); navigate('/login'); return; }
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({ name: item.name, qty: item.quantity || 1, image: item.image || item.img || '', price: Number(item.price), product: item._id || item.id })),
        shippingAddress: { address: addr.house + (addr.street ? ', ' + addr.street : ''), city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone, email: addr.email },
        paymentMethod,
        totalPrice: totalAmount,
        deliveryCharge,
      };
      await axios.post(API + '/api/orders', orderData, { headers: { Authorization: 'Bearer ' + token } });
      playBeep();
      clearCart();
      toast.success('Order placed! Email confirmation sent.');
      navigate('/order-success');
    } catch (err) {
      toast.error('Order failed: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  if (cart.length === 0) return null;

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '30px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '24px', color: '#2c3e50', fontFamily: 'Outfit, sans-serif' }}>Checkout</h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

          <div style={{ flex: '1 1 560px' }}>
            {/* Auto-fill banner */}
            {profile && (
              <div style={card2}>
                <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Your Details (Auto-filled)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['Name', profile.name], ['Email', profile.email], ['Mobile', profile.mobile || 'Not set'], ['Role', profile.role]].map(([l, v]) => (
                    <div key={l} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '10px 14px' }}>
                      <div style={{ fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '3px' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <a href="/profile" style={{ fontSize: '13px', color: '#2e7d32', fontWeight: '700', display: 'inline-block', marginTop: '10px' }}>Edit Profile</a>
              </div>
            )}

            {/* Address */}
            <div style={card2}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Delivery Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Email (for confirmation) *</label>
                  <input value={addr.email} onChange={e => setAddr({ ...addr, email: e.target.value })} placeholder="your@email.com" style={inp} type="email" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>House No / Flat *</label>
                  <input value={addr.house} onChange={e => setAddr({ ...addr, house: e.target.value })} placeholder="e.g. Flat 201, Sunrise Apartments" style={inp} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>Street / Area</label>
                  <input value={addr.street} onChange={e => setAddr({ ...addr, street: e.target.value })} placeholder="e.g. MG Road, Shivaji Nagar" style={inp} />
                </div>
                <div><label style={lbl}>City *</label><input value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} placeholder="Nagpur" style={inp} /></div>
                <div><label style={lbl}>State</label><input value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} placeholder="Maharashtra" style={inp} /></div>
                <div><label style={lbl}>Pincode *</label><input value={addr.pincode} onChange={e => setAddr({ ...addr, pincode: e.target.value })} placeholder="440001" maxLength={6} style={inp} /></div>
                <div><label style={lbl}>Phone</label><input value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} placeholder="10-digit mobile" maxLength={10} style={inp} /></div>
              </div>
            </div>

            {/* Payment */}
            <div style={card2}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Payment Method</h3>
              {[{ val: 'COD', label: 'Cash on Delivery', sub: '+5% service fee', color: '#e53935' },
                { val: 'UPI', label: 'UPI (GPay/PhonePe/Paytm)', sub: 'Zero fee - Fast', color: '#27ae60' },
                { val: 'Card', label: 'Debit / Credit Card', sub: 'Secure payment', color: '#3498db' }].map(pm => (
                <div key={pm.val}>
                  <label onClick={() => setPaymentMethod(pm.val)} style={{ display: 'flex', alignItems: 'center', padding: '14px', border: '2px solid ' + (paymentMethod === pm.val ? '#2e7d32' : '#eee'), borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', background: paymentMethod === pm.val ? '#f0fdf4' : '#fff' }}>
                    <input type="radio" name="pay" value={pm.val} checked={paymentMethod === pm.val} onChange={() => setPaymentMethod(pm.val)} />
                    <div style={{ marginLeft: '12px' }}>
                      <strong>{pm.label}</strong>
                      <p style={{ fontSize: '12px', color: pm.color, margin: '2px 0 0' }}>{pm.sub}</p>
                    </div>
                  </label>
                  {paymentMethod === 'UPI' && pm.val === 'UPI' && (
                    <div style={{ marginBottom: '10px' }}><input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={inp} /></div>
                  )}
                  {paymentMethod === 'Card' && pm.val === 'Card' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <input value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} placeholder="Card Number" maxLength={16} style={inp} />
                      <input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" maxLength={5} style={inp} />
                      <input value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} placeholder="CVV" maxLength={3} type="password" style={inp} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ ...card2, position: 'sticky', top: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Order Summary</h3>
              <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '14px' }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: '13px' }}>
                    <span style={{ flex: 1, paddingRight: '8px' }}>{item.name} x{item.quantity || 1}</span>
                    <strong>Rs.{(item.price * (item.quantity || 1)).toLocaleString()}</strong>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '14px' }}>
                <div style={row}><span>Subtotal</span><span>Rs.{subtotal.toLocaleString()}</span></div>
                <div style={{ ...row, color: paymentMethod === 'COD' ? '#e53935' : '#27ae60' }}>
                  <span>{paymentMethod === 'COD' ? 'COD Fee (5%)' : 'Delivery'}</span>
                  <span>{paymentMethod === 'COD' ? '+Rs.' + deliveryCharge : 'FREE'}</span>
                </div>
              </div>
              <div style={{ ...row, fontWeight: '800', fontSize: '20px', borderTop: '2px solid #eee', paddingTop: '14px', marginTop: '8px' }}>
                <span>Total:</span><span style={{ color: '#2e7d32' }}>Rs.{totalAmount.toLocaleString()}</span>
              </div>
              <button onClick={handlePlaceOrder} disabled={loading}
                style={{ width: '100%', padding: '15px', background: loading ? '#aaa' : '#fb641b', border: 'none', color: '#fff', fontWeight: '800', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', marginTop: '12px', fontFamily: 'Outfit, sans-serif' }}>
                {loading ? 'Placing Order...' : (paymentMethod === 'COD' ? 'CONFIRM ORDER' : 'PROCEED TO PAY')}
              </button>
              <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px' }}>Email confirmation tumhare inbox mein jayega</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const card2 = { background: '#fff', padding: '22px', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' };
const inp = { width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif' };
const lbl = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '6px' };
const row = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' };

export default Checkout;
