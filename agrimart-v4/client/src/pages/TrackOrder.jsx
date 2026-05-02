import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { HiOutlineBadgeCheck, HiTruck, HiHome, HiShoppingBag, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const statusMap = { 'Pending': 0, 'Confirmed': 0, 'Shipped': 1, 'Out for Delivery': 2, 'Delivered': 3 };

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
const res = await fetch('http://localhost:5000/api/orders/my-orders', {          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Order fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStages = (status) => {
    const idx = statusMap[status] ?? 0;
    return [
      { label: 'Placed',          icon: <HiShoppingBag />,      status: idx >= 0 ? 'completed' : 'pending' },
      { label: 'Shipped',         icon: <HiOutlineBadgeCheck />, status: idx >= 1 ? 'completed' : idx === 0 ? 'current' : 'pending' },
      { label: 'Out for Delivery',icon: <HiTruck />,             status: idx >= 2 ? 'completed' : idx === 1 ? 'current' : 'pending' },
      { label: 'Delivered',       icon: <HiHome />,              status: idx >= 3 ? 'completed' : idx === 2 ? 'current' : 'pending' },
    ];
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Navbar />Loading orders...</div>;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', paddingBottom: '50px' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
        <h2 style={{ marginBottom: '10px', color: '#1a1a1a', fontWeight: '800' }}>Order Tracking</h2>
        <p style={{ marginBottom: '25px', color: '#666' }}>Click on a product to explore tracking details.</p>

        {orders.length > 0 ? orders.map((order, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={order._id} style={orderCardStyle}>
              {/* Order Header */}
              <div style={{ marginBottom: '10px', fontSize: '13px', color: '#888' }}>
                Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong> &nbsp;|&nbsp;
                {new Date(order.createdAt).toLocaleDateString('en-IN')} &nbsp;|&nbsp;
                <strong>₹{order.totalPrice}</strong>
              </div>

              {order.orderItems.map((item, iIdx) => {
                const stages = getStages(order.status);
                const statusIdx = statusMap[order.status] ?? 0;
                return (
                  <div key={iIdx}>
                    <div
                      style={{ ...productHeaderStyle, cursor: 'pointer' }}
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    >
                      <img src={item.image} alt={item.name} style={imgStyle} />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{item.name}</h3>
                        <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                          Qty: {item.qty} | ₹{item.price}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={badgeStyle(order.status)}>{order.status}</div>
                        {isExpanded ? <HiChevronUp size={24} color="#999" /> : <HiChevronDown size={24} color="#999" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '20px', animation: 'fadeIn 0.4s ease' }}>
                        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
                        <div style={pathContainerStyle}>
                          {stages.map((stage, sIdx) => (
                            <div key={sIdx} style={{ flex: 1, position: 'relative', textAlign: 'center' }}>
                              {sIdx !== stages.length - 1 && (
                                <div style={{
                                  position: 'absolute', top: '20px', left: '50%', width: '100%', height: '3px',
                                  background: stage.status === 'completed' ? '#2e7d32' : '#e0e0e0', zIndex: 1
                                }} />
                              )}
                              <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto',
                                position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center',
                                alignItems: 'center',
                                background: stage.status === 'completed' ? '#2e7d32' : stage.status === 'current' ? '#fb641b' : '#fff',
                                color: (stage.status === 'completed' || stage.status === 'current') ? '#fff' : '#bdbdbd',
                                border: '2px solid',
                                borderColor: stage.status === 'completed' ? '#2e7d32' : stage.status === 'current' ? '#fb641b' : '#e0e0e0',
                                boxShadow: stage.status === 'current' ? '0 0 10px rgba(251,100,27,0.4)' : 'none'
                              }}>
                                {React.cloneElement(stage.icon, { size: 20 })}
                              </div>
                              <p style={{ fontSize: '12px', marginTop: '8px', fontWeight: '600', color: stage.status === 'pending' ? '#bdbdbd' : '#333' }}>
                                {stage.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '15px' }}>
            <p>Bidu, koi order record nahi mila! Kheti shuru kar.</p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

const orderCardStyle = { background: '#fff', padding: '25px', borderRadius: '18px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '25px', border: '1px solid #f1f1f1' };
const productHeaderStyle = { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' };
const imgStyle = { width: '75px', height: '75px', borderRadius: '12px', objectFit: 'cover', background: '#f9f9f9', border: '1px solid #eee' };
const badgeStyle = (status) => {
  const colors = { Delivered: ['#f0fdf4','#15803d','#dcfce7'], Shipped: ['#eff6ff','#1d4ed8','#dbeafe'], Cancelled: ['#fef2f2','#dc2626','#fee2e2'], Pending: ['#f8fafc','#64748b','#e2e8f0'] };
  const [bg, color, border] = colors[status] || colors.Pending;
  return { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: bg, color, border: `1px solid ${border}` };
};
const pathContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' };

export default TrackOrder;