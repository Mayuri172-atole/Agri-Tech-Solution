import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sections/Categories.css';

const categories = [
  { id: 1,  name: 'Offers',           img: 'https://cdn-icons-png.flaticon.com/512/879/879767.png',    route: '/marketplace?type=licensed', },
  { id: 2,  name: 'Vegetables',       img: 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png',  route: '/marketplace?category=Vegetables' },
  { id: 3,  name: 'Fruits',           img: 'https://cdn-icons-png.flaticon.com/512/3565/3565345.png',  route: '/marketplace?category=Fruits' },
  { id: 4,  name: 'Seeds',            img: 'https://cdn-icons-png.flaticon.com/512/2603/2603814.png',  route: '/marketplace?category=Seeds' },
  { id: 5,  name: 'Pesticides',       img: 'https://cdn-icons-png.flaticon.com/512/2852/2852178.png',  route: '/marketplace?category=Pesticide' },
  { id: 6,  name: 'Fertilizers',      img: 'https://cdn-icons-png.flaticon.com/512/2945/2945084.png',  route: '/marketplace?category=Fertilizer' },
  { id: 7,  name: 'Tools',            img: 'https://cdn-icons-png.flaticon.com/512/2401/2401035.png',  route: '/marketplace?category=Tools' },
  { id: 8,  name: 'Grains',           img: 'https://cdn-icons-png.flaticon.com/512/2503/2503940.png',  route: '/marketplace?category=Grains' },
  { id: 9,  name: 'Growth Promoters', img: 'https://cdn-icons-png.flaticon.com/512/2555/2555061.png',  route: '/marketplace?category=Fertilizer' },
  { id: 10, name: 'Farm Machinery',   img: 'https://cdn-icons-png.flaticon.com/512/2401/2401035.png',  route: '/marketplace?category=Tools' },
  { id: 11, name: 'Organic Farming',  img: 'https://cdn-icons-png.flaticon.com/512/2345/2345155.png',  route: '/marketplace?type=fresh' },
  { id: 12, name: 'New Arrivals',     img: 'https://cdn-icons-png.flaticon.com/512/1162/1162456.png',  route: '/marketplace' },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="categories-section" style={{ padding: '32px 20px', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 className="cat-title" style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          Agriculture Categories
        </h2>
        <p className="cat-subtitle" style={{ textAlign: 'center', color: '#636e72', marginBottom: '24px', fontSize: '14px' }}>
          Farming Needs Simplified
        </p>

        <div className="cat-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '16px'
        }}>
          {categories.map((item) => (
            <div
              key={item.id}
              className="cat-item"
              onClick={() => navigate(item.route)}
              style={{
                textAlign: 'center', cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="cat-circle" style={{
                width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto',
                background: '#fff', border: '2px solid #e8f5e9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <img src={item.img} alt={item.name}
                  style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                  onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2346/2346075.png'; }}
                />
              </div>
              <p className="cat-name" style={{
                marginTop: '8px', fontSize: '12px', fontWeight: 600,
                color: '#2d3436', lineHeight: 1.3
              }}>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
