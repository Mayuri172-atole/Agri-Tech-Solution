import React, { useState } from 'react';
import { HiOutlineQrcode, HiOutlineCreditCard, HiOutlineX, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const PaymentModal = ({ total, onClose, onPaymentSuccess }) => {
  const [method, setMethod] = useState('upi'); // 'upi' or 'card'
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handlePay = () => {
    const loadingToast = toast.loading("Processing Payment...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtn}><HiOutlineX size={20} /></button>
        
        {/* Method Selector Tabs */}
        <div style={tabContainer}>
          <button onClick={() => setMethod('upi')} style={{...tabBtn, borderBottom: method === 'upi' ? '3px solid #2e7d32' : 'none'}}>UPI / QR</button>
          <button onClick={() => setMethod('card')} style={{...tabBtn, borderBottom: method === 'card' ? '3px solid #2e7d32' : 'none'}}>Debit/Credit Card</button>
        </div>

        {method === 'upi' ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=agrimart@upi%26pn=AgriMart%26am=${total}`} 
              alt="QR" 
              style={{ borderRadius: '8px', border: '1px solid #eee' }}
            />
            <p style={{ margin: '15px 0', fontWeight: 'bold' }}>Amount: ₹{total}</p>
            <input type="text" placeholder="Enter Transaction ID" style={inputStyle} />
            <button onClick={handlePay} style={payBtn}>Verify & Confirm</button>
          </div>
        ) : (
          <div>
            {/* VIRTUAL CARD PREVIEW (PRO LOOK) */}
            <div style={virtualCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <HiOutlineCreditCard size={30} color="#fff" />
                <span style={{ color: '#fff', fontSize: '14px' }}>AgriMart Secure</span>
              </div>
              <div style={cardNumDisplay}>{cardData.number || "XXXX XXXX XXXX XXXX"}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '12px' }}>
                <div>
                  <label style={{ display: 'block', opacity: 0.7 }}>HOLDER NAME</label>
                  <span>{cardData.name.toUpperCase() || "YOUR NAME"}</span>
                </div>
                <div>
                  <label style={{ display: 'block', opacity: 0.7 }}>EXPIRY</label>
                  <span>{cardData.expiry || "MM/YY"}</span>
                </div>
              </div>
            </div>

            {/* CARD INPUTS */}
            <div style={{ marginTop: '20px' }}>
              <input name="number" maxLength="16" placeholder="Card Number" onChange={handleInputChange} style={inputStyle} />
              <input name="name" placeholder="Card Holder Name" onChange={handleInputChange} style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input name="expiry" placeholder="MM/YY" onChange={handleInputChange} style={inputStyle} />
                <input name="cvv" type="password" maxLength="3" placeholder="CVV" onChange={handleInputChange} style={inputStyle} />
              </div>
              <button onClick={handlePay} style={payBtn}>Pay ₹{total} Securely</button>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginTop: '15px', color: '#666', fontSize: '12px' }}>
          <HiShieldCheck color="#2e7d32" /> PCI DSS Compliant Payment
        </div>
      </div>
    </div>
  );
};

// Styles (Dhaasu Look)
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const modalStyle = { background: '#fff', padding: '25px', borderRadius: '20px', width: '90%', maxWidth: '420px', position: 'relative' };
const closeBtn = { position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer' };
const tabContainer = { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #eee' };
const tabBtn = { flex: 1, padding: '10px', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' };
const payBtn = { width: '100%', padding: '14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const virtualCard = { background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '20px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const cardNumDisplay = { color: '#fff', fontSize: '20px', letterSpacing: '2px', margin: '20px 0', textAlign: 'center' };

export default PaymentModal;