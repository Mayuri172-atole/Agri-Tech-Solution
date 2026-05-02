import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserInitials = ({ name, size = 80 }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.35, fontWeight: '900',
      border: '3px solid #a5d6a7', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get('http://localhost:5000/api/users/me', { headers }),
      axios.get('http://localhost:5000/api/videos/my', { headers }),
    ]).then(([uRes, vRes]) => {
      setUser(uRes.data);
      setVideos(vRes.data);
    }).catch(() => toast.error('Failed to load profile.')).finally(() => setLoading(false));
  }, []);

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setVideos(prev => prev.filter(v => v._id !== id));
      toast.success('Video deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  if (!token) return (
    <div style={s.centered}>
      <h2>Please <Link to="/login" style={{color:'#2e7d32'}}>log in</Link> to view your profile.</h2>
    </div>
  );

  if (loading) return <div style={s.centered}>Loading your profile...</div>;

  const statusColors = { Approved: '#2e7d32', Pending: '#f57f17', Rejected: '#c62828', Blocked: '#6a1b9a', 'Auto-Rejected': '#880e4f' };

  return (
    <div style={s.page}>
      {/* Profile Card */}
      <div style={s.profileCard}>
        <div style={s.profileTop}>
          <UserInitials name={user?.name} size={90} />
          <div style={s.profileInfo}>
            <h1 style={s.profileName}>{user?.name || 'User'}</h1>
            <div style={s.profileMeta}>
              <span style={s.roleBadge}>{user?.role?.toUpperCase()}</span>
              {user?.status && (
                <span style={{...s.statusBadge, background: statusColors[user.status] || '#888'}}>
                  {user.status}
                </span>
              )}
            </div>
            <div style={s.profileDetails}>
              <span>📧 {user?.email}</span>
              {user?.businessName && <span>🏢 {user.businessName}</span>}
              {user?.licenceNo && <span>📋 Licence: {user.licenceNo}</span>}
              {user?.userCategory && <span>🌾 Category: {user.userCategory}</span>}
            </div>
          </div>
        </div>
        <div style={s.statsRow}>
          <div style={s.statItem}>
            <span style={s.statNum}>{videos.length}</span>
            <span style={s.statLab}>Videos Uploaded</span>
          </div>
          <div style={s.statItem}>
            <span style={s.statNum}>{videos.filter(v => v.isApproved).length}</span>
            <span style={s.statLab}>Approved</span>
          </div>
          <div style={s.statItem}>
            <span style={s.statNum}>{videos.filter(v => !v.isApproved).length}</span>
            <span style={s.statLab}>Pending Review</span>
          </div>
        </div>
      </div>

      {/* Dealer Alert */}
      {user?.role === 'dealer' && user?.status === 'Pending' && (
        <div style={s.alertBanner}>
          ⏳ Your dealer account is pending admin approval. You will be notified once reviewed.
        </div>
      )}
      {user?.status === 'Blocked' && (
        <div style={{...s.alertBanner, background:'#ffebee', borderColor:'#ef9a9a', color:'#c62828'}}>
          🚫 Your account has been blocked. Please contact admin at semena_india@hotmail.com
        </div>
      )}

      {/* My Uploads */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>My Video Uploads</h2>
          <Link to="/agritube" style={s.viewAll}>Browse AgriTube →</Link>
        </div>
        {videos.length === 0 ? (
          <div style={s.empty}>
            <span style={{fontSize:'48px'}}>📹</span>
            <p>You haven't uploaded any videos yet.</p>
            <Link to="/agritube" style={s.uploadLink}>Upload your first video on AgriTube</Link>
          </div>
        ) : (
          <div style={s.videoGrid}>
            {videos.map(v => (
              <div key={v._id} style={s.videoCard}>
                <div style={s.videoThumb}>
                  <video preload="metadata" style={s.thumbVideo}>
                    <source src={`http://localhost:5000${v.videoUrl}`} />
                  </video>
                  <div style={{...s.approvalOverlay, background: v.isApproved ? 'rgba(46,125,50,0.85)' : 'rgba(245,127,23,0.85)'}}>
                    {v.isApproved ? '✅ Approved' : '⏳ Pending'}
                  </div>
                </div>
                <div style={s.videoMeta}>
                  <span style={s.catTag}>{v.category}</span>
                  <h4 style={s.videoTitle}>{v.title}</h4>
                  <div style={s.videoActions}>
                    <span style={s.dateText}>{new Date(v.createdAt).toLocaleDateString()}</span>
                    <button style={s.deleteBtn} onClick={() => handleDeleteVideo(v._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', fontFamily: 'Outfit, sans-serif' },
  centered: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontFamily: 'Outfit, sans-serif', fontSize: '18px' },
  profileCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', overflow: 'hidden', marginBottom: '24px' },
  profileTop: { display: 'flex', alignItems: 'flex-start', gap: '24px', padding: '32px', background: 'linear-gradient(135deg, #f1f8e9, #e8f5e9)', flexWrap: 'wrap' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: '28px', fontWeight: '900', color: '#1a3a1a', margin: '0 0 8px' },
  profileMeta: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' },
  roleBadge: { background: '#2e7d32', color: '#fff', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' },
  statusBadge: { color: '#fff', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: '700' },
  profileDetails: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: '#555' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid #e8f5e9' },
  statItem: { padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', borderRight: '1px solid #e8f5e9' },
  statNum: { fontSize: '32px', fontWeight: '900', color: '#2e7d32' },
  statLab: { fontSize: '12px', color: '#888', fontWeight: '600' },
  alertBanner: { background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '10px', padding: '14px 20px', color: '#795548', fontSize: '14px', fontWeight: '600', marginBottom: '24px' },
  section: { background: '#fff', borderRadius: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', overflow: 'hidden' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' },
  sectionTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#1a3a1a' },
  viewAll: { color: '#2e7d32', fontWeight: '700', textDecoration: 'none', fontSize: '14px' },
  empty: { padding: '60px', textAlign: 'center', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  uploadLink: { color: '#2e7d32', fontWeight: '700', textDecoration: 'none', fontSize: '15px' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', padding: '24px' },
  videoCard: { background: '#f9fbe7', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e8f5e9' },
  videoThumb: { position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden' },
  thumbVideo: { width: '100%', height: '100%', objectFit: 'contain' },
  approvalOverlay: { position: 'absolute', top: '8px', right: '8px', borderRadius: '12px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: '#fff' },
  videoMeta: { padding: '12px' },
  catTag: { background: '#e8f5e9', color: '#2e7d32', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', display: 'inline-block', marginBottom: '6px' },
  videoTitle: { fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.3 },
  videoActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: '11px', color: '#aaa' },
  deleteBtn: { background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'Outfit, sans-serif' },
};

export default Profile;
