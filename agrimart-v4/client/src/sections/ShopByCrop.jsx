import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sections/ShopByCrop.css';

// ✅ FIX: ShopByCrop shows ONLY static crop categories — NOT products!
// Clicking a crop navigates to marketplace filtered by that crop name

const crops = [
  { id: 1, name: 'Tomato',   img: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png', search: 'tomato' },
  { id: 2, name: 'Potato',   img: 'https://cdn-icons-png.flaticon.com/512/1135/1135544.png', search: 'potato' },
  { id: 3, name: 'Onion',    img: 'https://cdn-icons-png.flaticon.com/512/723/723701.png',   search: 'onion' },
  { id: 4, name: 'Chilli',   img: 'https://cdn-icons-png.flaticon.com/512/1031/1031317.png', search: 'chilli' },
  { id: 5, name: 'Rice',     img: 'https://cdn-icons-png.flaticon.com/512/2503/2503940.png', search: 'rice' },
  { id: 6, name: 'Wheat',    img: 'https://cdn-icons-png.flaticon.com/512/2403/2403195.png', search: 'wheat' },
  { id: 7, name: 'Cotton',   img: 'https://cdn-icons-png.flaticon.com/512/2951/2951268.png', search: 'cotton' },
  { id: 8, name: 'Maize',    img: 'https://cdn-icons-png.flaticon.com/512/2503/2503924.png', search: 'maize' },
  { id: 9, name: 'Mango',    img: 'https://cdn-icons-png.flaticon.com/512/3565/3565345.png', search: 'mango' },
  { id: 10, name: 'Banana',  img: 'https://cdn-icons-png.flaticon.com/512/4097/4097793.png', search: 'banana' },
];

const ShopByCrop = () => {
  const navigate = useNavigate();

  const handleCropClick = (crop) => {
    navigate(`/marketplace?search=${crop.search}`);
  };

  return (
    <section className="shop-by-crop" style={{ padding: '36px 20px', background: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Shop By Crop 🌾</h2>
            <p style={{ margin: '4px 0 0', color: '#636e72', fontSize: '14px' }}>
              Find products for your specific crop
            </p>
          </div>
          <button
            onClick={() => navigate('/all-crops')}
            style={{
              background: 'none', border: '1.5px solid #2e7d32', color: '#2e7d32',
              padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600
            }}
          >View All</button>
        </div>

        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
          {crops.map(crop => (
            <div
              key={crop.id}
              onClick={() => handleCropClick(crop)}
              style={{
                minWidth: '90px', textAlign: 'center', cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="crop-circle" style={{
                width: '72px', height: '72px', borderRadius: '50%',
                overflow: 'hidden', border: '2px solid #e8f5e9', margin: '0 auto',
                background: '#f4fbf4', display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 2px 8px rgba(46,125,50,0.12)'
              }}>
                <img src={crop.img} alt={crop.name}
                  style={{ width: '55px', height: '55px', objectFit: 'contain' }}
                  onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2346/2346075.png'; }}
                />
              </div>
              <p style={{
                marginTop: '8px', fontSize: '13px', fontWeight: 600,
                color: '#2d3436', whiteSpace: 'nowrap'
              }}>{crop.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCrop;
