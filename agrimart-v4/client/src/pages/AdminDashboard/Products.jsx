import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../../styles/AdminDashboard/AdminHome.css'; // Wahi CSS use kar lenge

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // 1. Dono sources se data uthao
    const farmerStock = JSON.parse(localStorage.getItem('farmerStock') || '[]');
    const dealerStock = JSON.parse(localStorage.getItem('approvedProducts') || '[]');

    // Dono ko ek list mein merge karo with a Tag (Role)
    const combined = [
      ...farmerStock.map(p => ({ ...p, source: 'Farmer' })),
      ...dealerStock.map(p => ({ ...p, source: 'Dealer' }))
    ];

    setAllProducts(combined);
  }, []);

  // --- DELETE LOGIC: Admin kisi bhi product ko hata sakta hai ---
  const deleteProduct = (id, source, name) => {
    if (window.confirm(`Bidu, pakka ${name} ko marketplace se hatana hai?`)) {
      const key = source === 'Farmer' ? 'farmerStock' : 'approvedProducts';
      const existingData = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedData = existingData.filter(p => p.id !== id);
      
      localStorage.setItem(key, JSON.stringify(updatedData));
      setAllProducts(allProducts.filter(p => p.id !== id));
      toast.success(`${name} removed from marketplace!`);
    }
  };

  // --- FILTER LOGIC ---
  const filteredProducts = allProducts.filter(p => {
    if (filter === 'All') return true;
    return p.source === filter;
  });

  return (
    <div className="products-admin-view">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3>📦 Global Inventory (Marketplace)</h3>
        
        {/* Filter Buttons */}
        <div className="filter-group">
          <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active-filter' : ''}>All</button>
          <button onClick={() => setFilter('Farmer')} className={filter === 'Farmer' ? 'active-filter' : ''}>Farmers</button>
          <button onClick={() => setFilter('Dealer')} className={filter === 'Dealer' ? 'active-filter' : ''}>Dealers</button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product Details</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Seller Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? filteredProducts.map(prod => (
            <tr key={prod.id}>
              <td>
                <strong>{prod.name}</strong> <br />
                <small style={{ color: '#666' }}>{prod.category}</small>
              </td>
              <td>₹{prod.price}</td>
              <td>{prod.stock}</td>
              <td>
                <span className={`role-badge ${prod.source.toLowerCase()}`}>
                  {prod.source}
                </span>
              </td>
              <td>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteProduct(prod.id, prod.source, prod.name)}
                  style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Marketplace is empty.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;