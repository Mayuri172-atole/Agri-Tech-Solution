import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const features = [
  {
    icon: '🔬',
    title: 'Crop Health AI',
    desc: 'Upload leaf photo → Get instant disease detection + dealer-linked remedy',
    link: '/crop-health',
    gradient: 'linear-gradient(135deg, #1b5e20, #43a047)',
    tag: 'Deep Learning',
  },
  {
    icon: '🤖',
    title: 'AgriBot',
    desc: 'Describe symptoms in Hindi/Marathi/English → Get fertilizer & pesticide advice',
    link: '/agribot',
    gradient: 'linear-gradient(135deg, #0d47a1, #1976d2)',
    tag: 'AI Chatbot',
  },
  {
    icon: '📹',
    title: 'AgriTube',
    desc: 'Video guides on tractors, drones, pesticide usage, crop cultivation & more',
    link: '/agritube',
    gradient: 'linear-gradient(135deg, #b71c1c, #e53935)',
    tag: 'Learning Hub',
  },
];

export default function AIFeaturesBanner() {
  const { t } = useLang();
  return (
    <section style={{ padding: '32px 16px', background: '#f9fbe7' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, color: '#1b5e20' }}>🤖 AI-Powered Farm Tools</h2>
          <p style={{ color: '#777', margin: '6px 0 0', fontSize: 15 }}>
            AgriMart ka Smart Kisan Program — Technology aur Farming ka Sangam
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              style={{ textDecoration: 'none', background: f.gradient, borderRadius: 18, padding: '24px 20px', color: '#fff', display: 'block', transition: 'transform .2s, box-shadow .2s', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 44 }}>{f.icon}</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{f.tag}</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 19 }}>{f.title}</h3>
              <p style={{ margin: '0 0 16px', opacity: 0.88, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
              <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '7px 18px', fontSize: 13, fontWeight: 700, border: '1.5px solid rgba(255,255,255,0.4)' }}>
                Try Now →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
