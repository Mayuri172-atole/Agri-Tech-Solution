import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

// ===== PRINT HELPER =====
const printSection = (title, contentHtml) => {
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${title} - AgriMart Report</title>
  <style>
    body{font-family:Arial,sans-serif;margin:30px;color:#333}
    h1{color:#2e7d32;border-bottom:3px solid #2e7d32;padding-bottom:10px}
    h2{color:#555;font-size:14px;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;margin-top:10px}
    th{background:#2e7d32;color:#fff;padding:10px;text-align:left;font-size:13px}
    td{padding:9px 10px;border-bottom:1px solid #eee;font-size:13px}
    tr:nth-child(even){background:#f9f9f9}
    .badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block}
    .green{background:#e8f5e9;color:#2e7d32}
    .orange{background:#fff3e0;color:#e65100}
    .red{background:#fdecea;color:#c0392b}
    .blue{background:#e3f2fd;color:#1565c0}
    .footer{margin-top:30px;font-size:11px;color:#888;border-top:1px solid #eee;padding-top:10px}
    @media print{.no-print{display:none}}
  </style></head><body>
  <h1>AgriMart — ${title}</h1>
  <h2>Generated: ${new Date().toLocaleString('en-IN')} | Powered by SEMENA Hybrid Seeds</h2>
  ${contentHtml}
  <div class="footer">AgriMart Admin Report | Confidential | support@agrimart.com</div>
  <script>window.onload=()=>{window.print()}</script>
  </body></html>`);
  w.document.close();
};

const AdminHome = () => {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [videos, setVideos] = useState([]);
  const [userFilter, setUserFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const H = { Authorization: 'Bearer ' + token };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, p, o, v] = await Promise.all([
        axios.get(API + '/api/users/all', { headers: H }),
        axios.get(API + '/api/products'),
        axios.get(API + '/api/orders', { headers: H }),
        axios.get(API + '/api/videos/admin/all', { headers: H }),
      ]);
      setUsers(u.data); setProducts(p.data); setOrders(o.data); setVideos(v.data);
    } catch (err) { toast.error('Data load failed'); }
    setLoading(false);
  };

// ✅ Yeh karo
useEffect(() => { 
  fetchAll(); 
  const interval = setInterval(fetchAll, 30000);
  return () => clearInterval(interval);
}, []);

  const doUser = async (action, id) => {
    const urls = { approve: '/approve/', reject: '/reject/', block: '/block/', delete: '/user/' };
    const methods = { delete: 'delete' };
    try {
      if (methods[action]) await axios[methods[action]](API + '/api/users' + urls[action] + id, { headers: H });
      else await axios.put(API + '/api/users' + urls[action] + id, {}, { headers: H });
      toast.success('Done!'); fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const doProduct = async (action, id) => {
    try {
      if (action === 'delete') await axios.delete(API + '/api/products/' + id, { headers: H });
      else await axios.put(API + '/api/products/' + id + '/approve', { status: action === 'approve' ? 'Live' : 'Rejected' }, { headers: H });
      toast.success('Done!'); fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const doVideo = async (action, id) => {
    try {
      if (action === 'delete') await axios.delete(API + '/api/videos/' + id, { headers: H });
      else await axios.put(API + '/api/videos/approve/' + id, {}, { headers: H });
      toast.success('Done!'); fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const badge = (s) => {
    const m = { Live: 'green', Approved: 'green', Pending: 'orange', 'Pending Approval': 'orange', Rejected: 'red', 'Auto-Rejected': 'red', Blocked: 'red', Confirmed: 'blue', Shipped: 'blue', Delivered: 'green', Cancelled: 'red', customer: 'blue', farmer: 'green', dealer: 'orange', admin: 'red' };
    return <span style={bd(m[s] || 'gray')}>{s}</span>;
  };

  const bd = (c) => {
    const col = { green: ['#e8f5e9', '#2e7d32'], orange: ['#fff3e0', '#e65100'], red: ['#fdecea', '#c0392b'], blue: ['#e3f2fd', '#1565c0'], gray: ['#f0f0f0', '#555'] };
    return { background: (col[c] || col.gray)[0], color: (col[c] || col.gray)[1], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' };
  };

  const filteredUsers = users.filter(u => {
    const mr = userFilter === 'All' || u.role === userFilter;
    const ms = !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
    return mr && ms;
  });
  const filteredProducts = productFilter === 'All' ? products : products.filter(p => p.status === productFilter);
  const pending = { users: users.filter(u => u.status === 'Pending').length, products: products.filter(p => p.status === 'Pending Approval').length, videos: videos.filter(v => !v.isApproved).length };

  // ===== PRINT FUNCTIONS =====
  const printUsers = () => {
    const rows = filteredUsers.map((u, i) =>
      `<tr><td>${i+1}</td><td><strong>${u.name}</strong><br><small>${u.email}</small></td><td>${u.mobile || '-'}</td>
      <td><span class="badge ${u.role === 'admin' ? 'red' : u.role === 'dealer' ? 'orange' : 'blue'}">${u.role}</span></td>
      <td><span class="badge ${u.status === 'Approved' ? 'green' : u.status === 'Pending' ? 'orange' : 'red'}">${u.status}</span></td>
      <td>${u.isVerified ? 'Yes' : 'No'}</td>
      <td>${new Date(u.createdAt).toLocaleDateString('en-IN')}</td></tr>`
    ).join('');
    printSection('User Report', `<table><thead><tr><th>#</th><th>Name / Email</th><th>Mobile</th><th>Role</th><th>Status</th><th>Verified</th><th>Registered</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="margin-top:15px"><strong>Total: ${filteredUsers.length}</strong> | Approved: ${users.filter(u=>u.status==='Approved').length} | Pending: ${pending.users} | Blocked: ${users.filter(u=>u.status==='Blocked').length}</p>`);
  };

  const printProducts = () => {
    const rows = filteredProducts.map((p, i) =>
      `<tr><td>${i+1}</td><td><strong>${p.name}</strong></td><td>${p.category}</td><td>${p.sellerName || p.seller || '-'}</td>
      <td>Rs.${p.price}</td><td>${p.countInStock || 0}</td>
      <td><span class="badge ${p.status === 'Live' ? 'green' : p.status === 'Pending Approval' ? 'orange' : 'red'}">${p.status}</span></td>
      <td>${new Date(p.createdAt).toLocaleDateString('en-IN')}</td></tr>`
    ).join('');
    printSection('Products Report', `<table><thead><tr><th>#</th><th>Product</th><th>Category</th><th>Seller</th><th>Price</th><th>Stock</th><th>Status</th><th>Added</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="margin-top:15px"><strong>Total: ${filteredProducts.length}</strong> | Live: ${products.filter(p=>p.status==='Live').length} | Pending: ${pending.products} | Rejected: ${products.filter(p=>p.status==='Rejected').length}</p>`);
  };

  const printOrders = () => {
    const totalRev = orders.filter(o=>o.status==='Delivered').reduce((s,o)=>s+o.totalPrice,0);
    const rows = orders.map((o, i) =>
      `<tr><td>${i+1}</td><td><code>${o._id.slice(-8).toUpperCase()}</code></td>
      <td>${o.user?.name || '-'}<br><small>${o.user?.email || ''}</small></td>
      <td>${o.orderItems?.length || 0} items</td>
      <td>Rs.${o.totalPrice}</td><td>${o.paymentMethod}</td>
      <td><span class="badge ${o.status==='Delivered'?'green':o.status==='Shipped'?'blue':o.status==='Cancelled'?'red':'orange'}">${o.status}</span></td>
      <td>${new Date(o.createdAt).toLocaleDateString('en-IN')}</td></tr>`
    ).join('');
    printSection('Orders & Revenue Report', `<table><thead><tr><th>#</th><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="margin-top:15px"><strong>Total Orders: ${orders.length}</strong> | Delivered: ${orders.filter(o=>o.status==='Delivered').length} | Pending: ${orders.filter(o=>o.status==='Pending').length} | Cancelled: ${orders.filter(o=>o.status==='Cancelled').length}</p>
    <p><strong>Total Revenue (Delivered): Rs.${totalRev.toLocaleString()}</strong></p>`);
  };

  const printVideos = () => {
    const rows = videos.map((v, i) =>
      `<tr><td>${i+1}</td><td><strong>${v.title}</strong></td><td>${v.category}</td>
      <td>${v.uploader?.name || '-'}</td><td>${v.uploaderRole || '-'}</td>
      <td>${v.isApproved ? '<span class="badge green">Approved</span>' : '<span class="badge orange">Pending</span>'}</td>
      <td>${new Date(v.createdAt).toLocaleDateString('en-IN')}</td></tr>`
    ).join('');
    printSection('Videos Report', `<table><thead><tr><th>#</th><th>Title</th><th>Category</th><th>Uploader</th><th>Role</th><th>Status</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="margin-top:15px"><strong>Total: ${videos.length}</strong> | Approved: ${videos.filter(v=>v.isApproved).length} | Pending: ${pending.videos}</p>`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pending-users', label: 'Pending Approvals ' + (pending.users > 0 ? '(' + pending.users + ')' : '') },
    { id: 'rejected-users', label: 'Rejected Users' },
    { id: 'blocked-users', label: 'Blocked Users' },
    { id: 'all-users', label: 'All Users' },
    { id: 'pending-products', label: 'Pending Products ' + (pending.products > 0 ? '(' + pending.products + ')' : '') },
    { id: 'all-products', label: 'All Products' },
    { id: 'videos', label: 'Videos ' + (pending.videos > 0 ? '(' + pending.videos + ')' : '') },
    { id: 'orders', label: 'Orders & Revenue' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a3c1a,#2e7d32)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '22px', fontWeight: '800' }}>AgriMart Admin</h1>
          <p style={{ color: '#a5d6a7', margin: '3px 0 0', fontSize: '13px' }}>CEO Control Panel — Full Reports & Management</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
<button onClick={fetchAll} disabled={loading} style={btnStyle('#3498db')}>
  {loading ? '⟳ Loading...' : '⟳ Refresh'}
</button>          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} style={btnStyle('#e74c3c')}>Logout</button>
        </div>
      </div>

      {/* Tab Nav - scrollable */}
      <div style={{ display: 'flex', overflowX: 'auto', background: '#fff', borderBottom: '1px solid #eee', padding: '0 16px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '12px 18px', border: 'none', background: 'none', borderBottom: tab === t.id ? '3px solid #2e7d32' : '3px solid transparent', fontWeight: tab === t.id ? '700' : '500', color: tab === t.id ? '#2e7d32' : '#666', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '22px 28px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={printUsers} style={btnStyle('#27ae60')}>Print User Report</button>
                <button onClick={printProducts} style={btnStyle('#3498db')}>Print Product Report</button>
                <button onClick={printOrders} style={btnStyle('#9b59b6')}>Print Revenue Report</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Total Users', val: users.length, c: '#3498db', icon: '👥' },
                { label: 'Pending Approvals', val: pending.users, c: '#e67e22', icon: '⏳' },
                { label: 'Total Products', val: products.length, c: '#27ae60', icon: '📦' },
                { label: 'Live Products', val: products.filter(p => p.status === 'Live').length, c: '#2ecc71', icon: '✅' },
                { label: 'Total Orders', val: orders.length, c: '#9b59b6', icon: '🛒' },
                { label: 'Total Revenue', val: 'Rs.' + orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalPrice, 0).toLocaleString(), c: '#e74c3c', icon: '💰' },
                { label: 'Total Videos', val: videos.length, c: '#1abc9c', icon: '📹' },
                { label: 'Pending Videos', val: pending.videos, c: '#e67e22', icon: '🎬' },
              ].map(st => (
                <div key={st.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', borderLeft: '5px solid ' + st.c }}>
                  <div style={{ fontSize: '24px' }}>{st.icon}</div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: st.c, margin: '6px 0 4px' }}>{st.val}</h3>
                  <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{st.label}</p>
                </div>
              ))}
            </div>

            {/* Quick breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={cardS}>
                <h3 style={{ marginBottom: '12px', fontSize: '15px' }}>👥 Users by Role</h3>
                {['customer', 'farmer', 'dealer', 'admin'].map(r => (
                  <div key={r} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ textTransform: 'capitalize', color: '#555', fontSize: '14px' }}>{r}</span>
                    <strong>{users.filter(u => u.role === r).length}</strong>
                  </div>
                ))}
              </div>
              <div style={cardS}>
                <h3 style={{ marginBottom: '12px', fontSize: '15px' }}>📦 Products Status</h3>
                {['Live', 'Pending Approval', 'Rejected'].map(s => (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#555', fontSize: '14px' }}>{s}</span>
                    <strong>{products.filter(p => p.status === s).length}</strong>
                  </div>
                ))}
              </div>
              <div style={cardS}>
                <h3 style={{ marginBottom: '12px', fontSize: '15px' }}>🛒 Orders Status</h3>
                {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#555', fontSize: '14px' }}>{s}</span>
                    <strong>{orders.filter(o => o.status === s).length}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* PENDING USERS */}
        {tab === 'pending-users' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>⏳ Pending Approvals ({users.filter(u => u.status === 'Pending').length})</h2>
              <button onClick={printUsers} style={btnStyle('#27ae60')}>Print Report</button>
            </div>
            <UserTable users={users.filter(u => u.status === 'Pending')} badge={badge} doUser={doUser} />
          </>
        )}

        {/* REJECTED USERS */}
        {tab === 'rejected-users' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>✗ Rejected Users ({users.filter(u => u.status === 'Rejected' || u.status === 'Auto-Rejected').length})</h2>
              <button onClick={printUsers} style={btnStyle('#27ae60')}>Print Report</button>
            </div>
            <UserTable users={users.filter(u => u.status === 'Rejected' || u.status === 'Auto-Rejected')} badge={badge} doUser={doUser} />
          </>
        )}

        {/* BLOCKED USERS */}
        {tab === 'blocked-users' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>🚫 Blocked Users ({users.filter(u => u.status === 'Blocked').length})</h2>
              <button onClick={printUsers} style={btnStyle('#27ae60')}>Print Report</button>
            </div>
            <UserTable users={users.filter(u => u.status === 'Blocked')} badge={badge} doUser={doUser} />
          </>
        )}

        {/* ALL USERS */}
        {tab === 'all-users' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>All Users ({filteredUsers.length})</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search..." style={searchS} />
                <select value={userFilter} onChange={e => setUserFilter(e.target.value)} style={searchS}>
                  <option>All</option><option value="customer">Customer</option><option value="farmer">Farmer</option><option value="dealer">Dealer</option><option value="admin">Admin</option>
                </select>
                <button onClick={printUsers} style={btnStyle('#27ae60')}>Print Report</button>
              </div>
            </div>
            <UserTable users={filteredUsers} badge={badge} doUser={doUser} />
          </>
        )}

        {/* PENDING PRODUCTS */}
        {tab === 'pending-products' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>⏳ Pending Product Approvals ({products.filter(p => p.status === 'Pending Approval').length})</h2>
              <button onClick={printProducts} style={btnStyle('#27ae60')}>Print Report</button>
            </div>
            <ProductTable products={products.filter(p => p.status === 'Pending Approval')} badge={badge} doProduct={doProduct} />
          </>
        )}

        {/* ALL PRODUCTS */}
        {tab === 'all-products' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>All Products ({filteredProducts.length})</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={productFilter} onChange={e => setProductFilter(e.target.value)} style={searchS}>
                  <option>All</option><option value="Live">Live</option><option value="Pending Approval">Pending</option><option value="Rejected">Rejected</option>
                </select>
                <button onClick={printProducts} style={btnStyle('#27ae60')}>Print Report</button>
              </div>
            </div>
            <ProductTable products={filteredProducts} badge={badge} doProduct={doProduct} />
          </>
        )}

        {/* VIDEOS */}
        {tab === 'videos' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>Videos ({videos.length})</h2>
              <button onClick={printVideos} style={btnStyle('#27ae60')}>Print Report</button>
            </div>
            <div style={tCard}>
              <div style={{ overflowX: 'auto' }}>
                <table style={tbl}>
                  <thead><tr style={tHead}>
                    {['#', 'Title', 'Category', 'Uploader', 'Role', 'Date', 'Status', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {videos.map((v, i) => (
                      <tr key={v._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={td}>{i+1}</td>
                        <td style={td}><strong style={{ fontSize: '14px' }}>{v.title}</strong></td>
                        <td style={td}>{badge(v.category)}</td>
                        <td style={td}>{v.uploader?.name || '-'}</td>
                        <td style={td}>{badge(v.uploaderRole || 'farmer')}</td>
                        <td style={{ ...td, fontSize: '12px', color: '#888' }}>{new Date(v.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={td}>{v.isApproved ? badge('Approved') : badge('Pending')}</td>
                        <td style={td}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {!v.isApproved && <button onClick={() => doVideo('approve', v._id)} style={smBtn('#27ae60')}>Approve</button>}
                            <button onClick={() => doVideo('delete', v._id)} style={smBtn('#c0392b')}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ORDERS & REVENUE */}
        {tab === 'orders' && (
          <>
            <div style={tableHeader}>
              <h2 style={{ margin: 0 }}>Orders & Revenue ({orders.length})</h2>
              <button onClick={printOrders} style={btnStyle('#27ae60')}>Print Revenue Report</button>
            </div>
            {/* Revenue summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Total Revenue', val: 'Rs.' + orders.filter(o=>o.status==='Delivered').reduce((s,o)=>s+o.totalPrice,0).toLocaleString(), c: '#27ae60' },
                { label: 'Pending Orders', val: orders.filter(o=>o.status==='Pending').length, c: '#e67e22' },
                { label: 'Delivered', val: orders.filter(o=>o.status==='Delivered').length, c: '#2ecc71' },
                { label: 'Cancelled', val: orders.filter(o=>o.status==='Cancelled').length, c: '#e74c3c' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', borderLeft: '5px solid ' + s.c }}>
                  <h3 style={{ color: s.c, margin: '0 0 4px', fontSize: '22px', fontWeight: '800' }}>{s.val}</h3>
                  <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={tCard}>
              <div style={{ overflowX: 'auto' }}>
                <table style={tbl}>
                  <thead><tr style={tHead}>
                    {['#', 'Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map(h => <th key={h} style={th}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={o._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={td}>{i+1}</td>
                        <td style={{ ...td, fontFamily: 'monospace', fontSize: '12px' }}>#{o._id.slice(-8).toUpperCase()}</td>
                        <td style={td}><strong>{o.user?.name || '-'}</strong><div style={{ color: '#888', fontSize: '12px' }}>{o.user?.email}</div></td>
                        <td style={td}>{o.orderItems?.length || 0} items</td>
                        <td style={td}><strong style={{ color: '#27ae60' }}>Rs.{o.totalPrice?.toLocaleString()}</strong></td>
                        <td style={td}>{o.paymentMethod}</td>
                        <td style={td}>{badge(o.status)}</td>
                        <td style={{ ...td, fontSize: '12px', color: '#888' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Sub-components
const UserTable = ({ users, badge, doUser }) => (
  <div style={tCard}>
    <div style={{ overflowX: 'auto' }}>
      <table style={tbl}>
        <thead><tr style={tHead}>
          {['#', 'Name', 'Email', 'Mobile', 'Role', 'Status', 'Registered', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
        </tr></thead>
        <tbody>
          {users.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No users found</td></tr> :
            users.map((u, i) => (
              <tr key={u._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                <td style={td}>{i+1}</td>
                <td style={td}><strong>{u.name}</strong>{u.businessName && <div style={{ color: '#888', fontSize: '12px' }}>{u.businessName}</div>}</td>
                <td style={{ ...td, fontSize: '13px' }}>{u.email}</td>
                <td style={td}>{u.mobile || '-'}</td>
                <td style={td}>{badge(u.role)}</td>
                <td style={td}>{badge(u.status || 'Pending')}</td>
                <td style={{ ...td, fontSize: '12px', color: '#888' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {u.status !== 'Approved' && <button onClick={() => doUser('approve', u._id)} style={smBtn('#27ae60')}>Approve</button>}
                    {u.status !== 'Rejected' && <button onClick={() => doUser('reject', u._id)} style={smBtn('#e67e22')}>Reject</button>}
                    {u.status !== 'Blocked' && <button onClick={() => doUser('block', u._id)} style={smBtn('#e74c3c')}>Block</button>}
                    <button onClick={() => doUser('delete', u._id)} style={smBtn('#c0392b')}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProductTable = ({ products, badge, doProduct }) => (
  <div style={tCard}>
    <div style={{ overflowX: 'auto' }}>
      <table style={tbl}>
        <thead><tr style={tHead}>
          {['#', 'Image', 'Product', 'Category', 'Seller', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}
        </tr></thead>
        <tbody>
          {products.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>No products found</td></tr> :
            products.map((p, i) => (
              <tr key={p._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                <td style={td}>{i+1}</td>
                <td style={td}><img src={p.image?.startsWith('/') ? 'http://localhost:5000' + p.image : p.image} alt={p.name} style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '8px' }} onError={e => { e.target.src = 'https://placehold.co/46x46/e8f5e9/2e7d32?text=P'; }} /></td>
                <td style={td}><strong style={{ fontSize: '14px' }}>{p.name}</strong></td>
                <td style={td}>{badge(p.category)}</td>
                <td style={{ ...td, fontSize: '13px' }}>{p.sellerName || p.seller || '-'}</td>
                <td style={td}><strong style={{ color: '#27ae60' }}>Rs.{p.price?.toLocaleString()}</strong></td>
                <td style={td}>{p.countInStock || 0}</td>
                <td style={td}>{badge(p.status)}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {p.status !== 'Live' && <button onClick={() => doProduct('approve', p._id)} style={smBtn('#27ae60')}>Approve</button>}
                    {p.status !== 'Rejected' && <button onClick={() => doProduct('reject', p._id)} style={smBtn('#e67e22')}>Reject</button>}
                    <button onClick={() => doProduct('delete', p._id)} style={smBtn('#c0392b')}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

const tCard = { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' };
const cardS = { background: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' };
const tbl = { width: '100%', borderCollapse: 'collapse' };
const tHead = { background: '#f8f9fa', borderBottom: '2px solid #eee' };
const th = { padding: '13px 14px', textAlign: 'left', fontWeight: '700', fontSize: '12px', color: '#555', whiteSpace: 'nowrap' };
const td = { padding: '13px 14px', fontSize: '14px', verticalAlign: 'middle' };
const tableHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' };
const searchS = { padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'Outfit, sans-serif' };
const smBtn = (bg) => ({ padding: '4px 10px', background: bg + '20', color: bg, border: '1px solid ' + bg, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' });
const btnStyle = (bg) => ({ padding: '8px 16px', background: bg, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: 'Outfit, sans-serif' });

export default AdminHome;
