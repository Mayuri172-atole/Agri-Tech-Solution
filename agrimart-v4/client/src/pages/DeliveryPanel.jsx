import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/DeliveryPanel.css';

const API = import.meta.env.VITE_API_URL || '';

export default function DeliveryPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [partner, setPartner] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ email:'', password:'' });
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('deliveryToken');
    const p = localStorage.getItem('deliveryPartner');
    if (token && p) { setPartner(JSON.parse(p)); setIsLoggedIn(true); }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('deliveryToken');
      const { data } = await axios.get(`${API}/api/delivery/my-orders`, { headers:{ Authorization:`Bearer ${token}` } });
      setOrders(data);
    } catch { setOrders([]); }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const { data } = await axios.post(`${API}/api/delivery/login`, form);
      localStorage.setItem('deliveryToken', data.token);
      localStorage.setItem('deliveryPartner', JSON.stringify(data));
      setPartner(data); setIsLoggedIn(true);
    } catch { setMsg('❌ Login failed. Check credentials.'); }
    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('deliveryToken');
      await axios.put(`${API}/api/delivery/orders/${orderId}/status`, { status }, { headers:{ Authorization:`Bearer ${token}` } });
      fetchOrders();
      setMsg(`✅ Order status updated to "${status}"`);
    } catch { setMsg('❌ Update failed'); }
  };

  const logout = () => {
    localStorage.removeItem('deliveryToken');
    localStorage.removeItem('deliveryPartner');
    setIsLoggedIn(false); setPartner(null); setOrders([]);
  };

  const filtered = orders.filter(o => {
    if (tab === 'pending') return ['Pending','Confirmed','Shipped','Out for Delivery'].includes(o.status);
    return o.status === 'Delivered';
  });

  if (!isLoggedIn) return (
    <div className="dp-login-wrap">
      <div className="dp-login-card">
        <div className="dp-login-icon">🚚</div>
        <h2>Delivery Partner Login</h2>
        <p>AgriMart Logistics Panel</p>
        {msg && <div className="dp-msg error">{msg}</div>}
        <form onSubmit={login} className="dp-form">
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required />
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : '🚚 Login'}</button>
        </form>
        <p style={{fontSize:12,color:'#999',textAlign:'center',marginTop:12}}>
          New delivery partner? Contact: admin@agrimart.in
        </p>
      </div>
    </div>
  );

  return (
    <div className="dp-wrapper">
      <div className="dp-header">
        <div>
          <h2>🚚 Delivery Panel</h2>
          <p>Welcome, <strong>{partner?.name}</strong> | Zone: {partner?.zone || 'All'} | Vehicle: {partner?.vehicle}</p>
        </div>
        <button className="dp-logout" onClick={logout}>Logout</button>
      </div>

      {msg && <div className="dp-msg success">{msg}</div>}

      <div className="dp-stats">
        <div className="dp-stat-card blue">
          <div className="dp-stat-num">{orders.filter(o=>['Pending','Confirmed','Shipped','Out for Delivery'].includes(o.status)).length}</div>
          <div>Active Orders</div>
        </div>
        <div className="dp-stat-card green">
          <div className="dp-stat-num">{orders.filter(o=>o.status==='Delivered').length}</div>
          <div>Delivered</div>
        </div>
        <div className="dp-stat-card orange">
          <div className="dp-stat-num">{orders.filter(o=>o.paymentMethod==='COD' && o.status!=='Delivered').length}</div>
          <div>COD Pending</div>
        </div>
      </div>

      <div className="dp-tabs">
        <button className={tab==='pending'?'active':''} onClick={()=>setTab('pending')}>🔄 Active Orders</button>
        <button className={tab==='delivered'?'active':''} onClick={()=>setTab('delivered')}>✅ Delivered</button>
      </div>

      <div className="dp-orders">
        {filtered.length === 0 && <div className="dp-empty">No orders in this section 📭</div>}
        {filtered.map(order => (
          <div key={order._id} className="dp-order-card">
            <div className="dp-order-header">
              <div>
                <span className="dp-tracking">{order.trackingId}</span>
                <span className={`dp-status ${order.status.toLowerCase().replace(/ /g,'-')}`}>{order.status}</span>
              </div>
              <div className="dp-pay-info">
                <span className={`dp-pay ${order.paymentMethod}`}>{order.paymentMethod}</span>
                <strong>₹{order.totalPrice}</strong>
              </div>
            </div>

            <div className="dp-address">
              <span>📍</span>
              <div>
                <strong>{order.shippingAddress?.address}</strong>
                <br/>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                <br/><a href={`tel:${order.shippingAddress?.phone}`} className="dp-call-btn">📞 {order.shippingAddress?.phone}</a>
              </div>
            </div>

            <div className="dp-items">
              {order.orderItems?.map((item,i) => (
                <div key={i} className="dp-item">{item.name} × {item.qty}</div>
              ))}
            </div>

            {order.paymentMethod === 'COD' && order.status !== 'Delivered' && (
              <div className="dp-cod-alert">💰 Collect ₹{order.totalPrice} cash on delivery</div>
            )}

            {tab === 'pending' && (
              <div className="dp-actions">
                {order.status === 'Confirmed' && <button className="dp-btn blue" onClick={()=>updateStatus(order._id,'Shipped')}>📦 Mark Shipped</button>}
                {order.status === 'Shipped' && <button className="dp-btn orange" onClick={()=>updateStatus(order._id,'Out for Delivery')}>🚴 Out for Delivery</button>}
                {order.status === 'Out for Delivery' && <button className="dp-btn green" onClick={()=>updateStatus(order._id,'Delivered')}>✅ Mark Delivered</button>}
                {order.status === 'Pending' && <button className="dp-btn blue" onClick={()=>updateStatus(order._id,'Confirmed')}>✔ Confirm Pickup</button>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="dp-refresh" onClick={fetchOrders}>🔄 Refresh Orders</button>
    </div>
  );
}
