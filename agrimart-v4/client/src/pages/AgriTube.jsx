import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Seeds', 'Crop Nutrition', 'Crop Protection', 'Tutorials', 'Farmer Stories', 'Equipment', 'Organic'];

// Helper function to extract YouTube ID
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoCard = ({ video }) => {
  const ytID = video.youtubeUrl ? getYouTubeID(video.youtubeUrl) : null;

  return (
    <div style={s.card}>
      <div style={s.videoWrap}>
        {/* ✅ FIX: Toggle between Local Video and YouTube Embed */}
        {ytID ? (
          <iframe
            style={{ width: '100%', height: '100%', border: 'none' }}
            src={`https://www.youtube.com/embed/${ytID}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video controls style={s.video} preload="metadata">
            <source src={`http://localhost:5000${video.videoUrl}`} />
            Your browser does not support video.
          </video>
        )}
      </div>
      <div style={s.cardBody}>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={s.catTag}>{video.category}</span>
          {video.hashtags?.map((tag, i) => (
            <span key={i} style={{ ...s.catTag, background: '#e3f2fd', color: '#1976d2' }}>#{tag}</span>
          ))}
        </div>
        <h3 style={s.cardTitle}>{video.title}</h3>
        {video.description && <p style={s.cardDesc}>{video.description}</p>}
        <div style={s.cardMeta}>
          <span style={s.uploaderBadge}>
            {video.uploader?.name || 'SEMENA Team'} · 
            <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>
              {video.uploaderRole === 'customer' ? 'Farmer Contributor' : 
               video.uploaderRole === 'dealer' ? 'Equipment Dealer' : 'Admin'}
            </span>
          </span>
          <span style={s.dateMeta}>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const AgriTube = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = selectedCat !== 'All' ? { category: selectedCat } : {};
      const { data } = await axios.get('http://localhost:5000/api/videos', { params });
      setVideos(data);
    } catch { toast.error('Failed to load videos.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVideos(); }, [selectedCat]);

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>📹 AgriTube</h1>
        <p style={s.heroSub}>Agricultural Knowledge — Video Platform by SEMENA Hybrid Seeds</p>
        {isLoggedIn && (
          <button style={s.uploadBtn} onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? '✕ Close Uploader' : '+ Upload Video'}
          </button>
        )}
      </div>

      {showUpload && isLoggedIn && <VideoUploadPanel onSuccess={() => { fetchVideos(); setShowUpload(false); }} />}

      <div style={s.filterRow}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            style={{...s.filterBtn, ...(selectedCat === cat ? s.filterActive : {})}}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.loadingState}>Loading videos...</div>
      ) : videos.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{fontSize:'64px'}}>📹</div>
          <h3>No videos in this category yet.</h3>
          <p>Be the first to share agricultural knowledge!</p>
        </div>
      ) : (
        <div style={s.grid}>
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
};

const VideoUploadPanel = ({ onSuccess }) => {
  const [form, setForm] = useState({ title: '', category: 'Seeds', description: '', hashtags: '', youtubeUrl: '' });
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith('video/')) {
      toast.error('Only video files allowed.');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadType === 'file' && !file) { toast.error('Please select a video file.'); return; }
    if (uploadType === 'link' && !form.youtubeUrl) { toast.error('Please paste a YouTube link.'); return; }
    if (!form.title.trim()) { toast.error('Video title is required.'); return; }

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('description', form.description);
    fd.append('hashtags', form.hashtags);
    
    if (uploadType === 'file') {
      fd.append('video', file);
    } else {
      fd.append('youtubeUrl', form.youtubeUrl);
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/videos/upload', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Submitted! Pending admin approval.');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally { setUploading(false); }
  };

  return (
    <div style={up.panel}>
      <h3 style={up.title}>Share Agricultural Video</h3>
      
      {/* ✅ FIX: Upload Type Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setUploadType('file')} style={{ ...up.toggleBtn, background: uploadType === 'file' ? '#2e7d32' : '#f0f0f0', color: uploadType === 'file' ? '#fff' : '#333' }}>Upload File</button>
        <button onClick={() => setUploadType('link')} style={{ ...up.toggleBtn, background: uploadType === 'link' ? '#2e7d32' : '#f0f0f0', color: uploadType === 'link' ? '#fff' : '#333' }}>YouTube Link</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={up.grid2}>
          <div style={up.field}>
            <label style={up.label}>Video Title *</label>
            <input style={up.input} type="text" placeholder="Enter title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div style={up.field}>
            <label style={up.label}>Category *</label>
            <select style={up.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        <div style={up.field}>
          <label style={up.label}>Hashtags (e.g. wheat, organic, tools)</label>
          <input style={up.input} type="text" placeholder="hashtags..." value={form.hashtags} onChange={e => setForm({...form, hashtags: e.target.value})} />
        </div>

        {/* ✅ FIX: Conditional Input for File or Link */}
        {uploadType === 'file' ? (
          <div style={up.field}>
            <label style={up.label}>Video File *</label>
            <input ref={fileRef} type="file" accept="video/*" onChange={handleFileChange} style={up.fileInput} />
          </div>
        ) : (
          <div style={up.field}>
            <label style={up.label}>YouTube URL *</label>
            <input style={up.input} type="text" placeholder="https://www.youtube.com/watch?v=..." value={form.youtubeUrl} onChange={e => setForm({...form, youtubeUrl: e.target.value})} />
          </div>
        )}

        <div style={up.field}>
          <label style={up.label}>Description</label>
          <textarea style={{...up.input, height: '60px'}} placeholder="Description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <button type="submit" style={up.btn} disabled={uploading}>
          {uploading ? 'Processing...' : '📤 Submit for Review'}
        </button>
      </form>
    </div>
  );
};

const s = {
  page: { maxWidth: '1300px', margin: '0 auto', padding: '32px 20px', fontFamily: 'Outfit, sans-serif' },
  hero: { background: 'linear-gradient(135deg, #1a3a1a, #2e7d32)', borderRadius: '16px', padding: '40px 32px', color: '#fff', textAlign: 'center', marginBottom: '28px' },
  heroTitle: { fontSize: '42px', fontWeight: '900', margin: '0 0 8px' },
  heroSub: { color: '#a5d6a7', fontSize: '15px', margin: '0 0 20px' },
  uploadBtn: { background: '#ff9800', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' },
  filterBtn: { padding: '8px 18px', border: '2px solid #e0e0e0', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' },
  filterActive: { background: '#2e7d32', color: '#fff', borderColor: '#2e7d32' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.09)', overflow: 'hidden' },
  videoWrap: { background: '#000', aspectRatio: '16/9', overflow: 'hidden' },
  video: { width: '100%', height: '100%', objectFit: 'contain' },
  cardBody: { padding: '16px' },
  catTag: { background: '#e8f5e9', color: '#2e7d32', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: '700', display: 'inline-block' },
  cardTitle: { fontSize: '15px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 6px' },
  cardDesc: { fontSize: '13px', color: '#666', margin: '0 0 10px' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  uploaderBadge: { fontSize: '12px', color: '#888', textTransform: 'capitalize' },
  dateMeta: { fontSize: '11px', color: '#bbb' },
  loadingState: { textAlign: 'center', padding: '80px', color: '#999' },
  emptyState: { textAlign: 'center', padding: '80px', color: '#999' },
};

const up = {
  panel: { background: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '28px', boxShadow: '0 2px 16px rgba(0,0,0,0.09)', border: '2px solid #e8f5e9' },
  title: { fontSize: '18px', fontWeight: '800', margin: '0 0 8px' },
  toggleBtn: { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginBottom: '6px' },
  input: { width: '100%', padding: '10px', border: '1.5px solid #c8e6c9', borderRadius: '7px' },
  fileInput: { width: '100%', padding: '10px', border: '2px dashed #4caf50', borderRadius: '8px' },
  btn: { background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: '800', cursor: 'pointer' },
};

export default AgriTube;