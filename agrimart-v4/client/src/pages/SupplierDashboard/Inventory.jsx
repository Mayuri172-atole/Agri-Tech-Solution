import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../../styles/SupplierDashboard/SupplierHome.css';

const API = 'http://localhost:5000';

const CATEGORIES = {
  farmer:  ['Vegetables', 'Fruits', 'Grains/Pulses'],
  dealer:  {
    'Pesticide/Fertilizer': ['Pesticide', 'Fertilizer', 'Seeds'],
    'Equipment':            ['Hand Tools', 'Power Tools', 'Irrigation', 'Machinery', 'Safety Gear'],
  }
};

const getCategories = (role, category) => {
  if (role === 'farmer') return CATEGORIES.farmer;
  if (role === 'dealer') return CATEGORIES.dealer[category] || CATEGORIES.dealer['Pesticide/Fertilizer'];
  return CATEGORIES.farmer;
};

const Inventory = ({ role, category }) => {
  const email      = localStorage.getItem('activeUserEmail');
  const isVerified = localStorage.getItem(`isVerified_${email}`) === 'true';
  const isDealer   = role === 'dealer' && category === 'Pesticide/Fertilizer';
  const isTooler   = role === 'dealer' && category === 'Equipment';
  const isFarmer   = role === 'farmer';

  const cats = getCategories(role, category);

  const [myProducts, setMyProducts]   = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // ✅ LINE 33 - added
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile]       = useState(null);
  const [uploading, setUploading]       = useState(false);

  const [product, setProduct] = useState({
    name: '', price: '', stock: '', category: cats[0],
    description: '', chemicalInfo: '', expiryDate: '', image: ''
  });

  useEffect(() => {
    setProduct(p => ({ ...p, category: cats[0] }));
  }, [role, category]);

  // ✅ LINE 47 - Fixed: seller email se filter
  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/products?seller=${email}`, { // ✅ changed
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyProducts(Array.isArray(data) ? data : []); // ✅ changed
    } catch (err) {
      console.log('Load failed:', err.message);
    }
  };

  useEffect(() => { loadData(); }, [email]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image 5MB se bada nahi hona chahiye!'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDealer && !isVerified) return toast.error('Admin approval ke bina add nahi kar sakte!');
    if (!product.name || !product.price || !product.stock) return toast.error('Sabhi fields fill karein!');

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      let imageUrl = product.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data: uploadData } = await axios.post(`${API}/api/products/upload`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadData.imageUrl;
      }

      // ✅ LINE 83 - Tooler bhi auto Live
      const productType = isFarmer ? 'fresh' : isTooler ? 'equipment' : 'licensed';
      const status      = (isFarmer || isTooler) ? 'Live' : 'Pending Approval'; // ✅ changed

      const newProduct = {
        ...product,
        image: imageUrl,
        productType,
        status,
        seller: email,
        sellerName: localStorage.getItem('userName') || 'Agri Seller',
        countInStock: parseInt(product.stock) || 10,
        type: productType,
      };

      await axios.post(`${API}/api/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ LINE 99 - Toast by role
      toast.success(isFarmer ? '✅ Product Live on Marketplace!' : isTooler ? '✅ Equipment Live on Marketplace!' : '⏳ Sent for Admin Approval!');
      setProduct({ name: '', price: '', stock: '', category: cats[0], description: '', chemicalInfo: '', expiryDate: '', image: '' });
      setImagePreview(null);
      setImageFile(null);
      loadData();
    } catch (err) {
      toast.error('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const getTitle = () => {
    if (isDealer) return 'Add Chemical / Fertilizer';
    if (isTooler) return 'Add Equipment / Tools';
    return 'List Your Harvest';
  };

  // ✅ LINE 114 - Filter helper
  const filteredProducts = statusFilter === 'All'
    ? myProducts
    : myProducts.filter(p => p.status === statusFilter);

  return (
    <div className="supplier-container">
      <main className="supplier-main">
        <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>

          <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: '#2d3436' }}>{getTitle()}</h2>
              <p style={{ fontSize: '14px', color: '#636e72' }}>Add items for the AgriMart marketplace</p>
            </div>
            <span style={{ padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: isVerified ? '#e8f5e9' : '#fff3e0', color: isVerified ? '#2e7d32' : '#d35400' }}>
              {isDealer ? (isVerified ? '● Verified Dealer' : '● Under Review') : isTooler ? '● Equipment Dealer' : '● Active Farmer'}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
              <div>
                <label style={lbl}>Product Name *</label>
                <input style={inp} placeholder={isDealer ? 'e.g. Glyphosate 41% SL' : isTooler ? 'e.g. Hand Weeder Pro' : 'e.g. Fresh Organic Potatoes'}
                  value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} required />
              </div>
              <div>
                <label style={lbl}>Category *</label>
                <select style={inp} value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })}>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
              <div>
                <label style={lbl}>Price (₹) *</label>
                <input style={inp} type="number" placeholder="0.00"
                  value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} required />
              </div>
              <div>
                <label style={lbl}>Stock Quantity *</label>
                <input style={inp} placeholder="e.g. 100"
                  value={product.stock} onChange={e => setProduct({ ...product, stock: e.target.value })} required />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={lbl}>Product Image *</label>
              <div style={{ border: '2px dashed #c8e6c9', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#f9fffe' }}
                onClick={() => document.getElementById('imgInput').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
                ) : (
                  <div>
                    <div style={{ fontSize: '40px' }}>📷</div>
                    <p style={{ color: '#666', margin: '8px 0 0', fontSize: '14px' }}>Click to upload product image</p>
                    <p style={{ color: '#999', fontSize: '12px' }}>JPG, PNG — max 5MB</p>
                  </div>
                )}
              </div>
              <input id="imgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              {imagePreview && (
                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                  style={{ marginTop: '8px', fontSize: '12px', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                  ✕ Remove Image
                </button>
              )}
            </div>

            {isDealer && (
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2e7d32' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={lbl}>Chemical Batch No. *</label>
                    <input style={inp} placeholder="e.g. MH-BATCH-2024"
                      value={product.chemicalInfo} onChange={e => setProduct({ ...product, chemicalInfo: e.target.value })} required />
                  </div>
                  <div>
                    <label style={lbl}>Expiry Date *</label>
                    <input style={inp} type="date"
                      value={product.expiryDate} onChange={e => setProduct({ ...product, expiryDate: e.target.value })} required />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>Product Description</label>
              <textarea rows="3" style={{ ...inp, resize: 'vertical' }}
                placeholder={isTooler ? 'Mention tool specs, usage, warranty...' : isDealer ? 'Mention usage instructions, safety info...' : 'Mention freshness, origin, harvest date...'}
                value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} />
            </div>

            <button type="submit" disabled={(isDealer && !isVerified) || uploading}
              style={{ width: '100%', padding: '15px', background: (isDealer && !isVerified) ? '#ccc' : '#2e7d32', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: (isDealer && !isVerified) ? 'not-allowed' : 'pointer', fontSize: '15px' }}>
              {uploading ? '⏳ Uploading...' : isDealer ? (isVerified ? '✅ SUBMIT TO MARKETPLACE' : '🔒 WAITING FOR ADMIN') : isTooler ? '🔧 LIST EQUIPMENT NOW' : '🌾 POST HARVEST NOW'}
            </button>
          </form>

          {/* ✅ LINE 218 - My Listings with status filter tabs */}
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '15px' }}>
              <h3 style={{ color: '#2d3436', margin: 0 }}>My Listings</h3>
              {/* ✅ Status filter tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['All', 'Live', 'Pending Approval', 'Rejected'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                      fontWeight: '600', cursor: 'pointer', border: '1.5px solid',
                      borderColor: statusFilter === s ? '#2e7d32' : '#ddd',
                      background: statusFilter === s ? '#2e7d32' : '#fff',
                      color: statusFilter === s ? '#fff' : '#666'
                    }}>
                    {s} ({s === 'All' ? myProducts.length : myProducts.filter(p => p.status === s).length})
                  </button>
                ))}
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '10px' }}>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? filteredProducts.map(p => (
                  <tr key={p._id || p.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '10px' }}>
                      <img src={p.image || 'https://placehold.co/50x50/e8f5e9/2e7d32?text=IMG'}
                        alt={p.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '10px' }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.stock || p.countInStock}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <span style={{
                        fontSize: '11px', padding: '4px 10px', borderRadius: '10px', fontWeight: '700',
                        background: p.status === 'Live' ? '#e8f5e9' : p.status === 'Pending Approval' ? '#fff3e0' : '#fdecea',
                        color: p.status === 'Live' ? '#2e7d32' : p.status === 'Pending Approval' ? '#d35400' : '#c0392b'
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    {statusFilter === 'All' ? 'No items added yet.' : `No ${statusFilter} products.`}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

const inp = { width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #dcdde1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif' };
const lbl = { display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: '#555' };

export default Inventory;