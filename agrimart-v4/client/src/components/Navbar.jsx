import React, { useState, useRef } from 'react';
import { HiOutlineSearch, HiOutlineUser, HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi';
import { MdLocalShipping, MdLogout, MdDashboard, MdMic, MdMicOff, MdCameraAlt } from 'react-icons/md';
import { navData } from '../data/navData';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, wishlist } = useCart();
  const [searchTerm, setSearchTerm]     = useState('');
  const [isListening, setIsListening]   = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoSearching, setPhotoSearching] = useState(false);

  const fileInputRef   = useRef(null);
  const cameraInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole   = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        navigate(`/marketplace?search=${searchTerm.toLowerCase().trim()}`);
        setSearchTerm('');
      }
    }
  };

  // ✅ VOICE SEARCH
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Tera browser voice search support nahi karta!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast('🎤 Bol do... sun raha hoon!', { duration: 2000 });
    };

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript).join('');
      setSearchTerm(transcript);

      if (e.results[e.results.length - 1].isFinal) {
        navigate(`/marketplace?search=${transcript.toLowerCase().trim()}`);
        setSearchTerm('');
        setIsListening(false);
      }
    };

    recognition.onerror = (e) => {
      toast.error('Voice error: ' + e.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ✅ PHOTO SEARCH — using Gemini AI (FREE) via backend proxy
  const handlePhotoSearch = async (file) => {
    if (!file) return;
    setPhotoSearching(true);
    setPhotoPreview(URL.createObjectURL(file));

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // ✅ CHANGED: localhost backend proxy — CORS fix
      const response = await fetch('http://localhost:5000/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: file.type || 'image/jpeg', data: base64 }
              },
              {
                type: 'text',
                text: 'This is an agricultural e-commerce site. Identify the main agricultural product, crop, seed, fertilizer, pesticide, or farming tool in this image. Reply with ONLY 1-3 keywords suitable for a product search query. No explanation.'
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const keywords = data.content?.[0]?.text?.trim() || '';

      if (keywords) {
        setSearchTerm(keywords);
        toast.success(`🔍 Found: "${keywords}"`);
        navigate(`/marketplace?search=${keywords.toLowerCase()}`);
      } else {
        toast.error('Product identify nahi hua, dusri photo try karo!');
      }
    } catch (err) {
      toast.error('Photo search failed: ' + err.message);
    } finally {
      setPhotoSearching(false);
      setPhotoPreview(null);
    }
  };

  const mainLinks = [
    'HOME', 'BRANDS', 'SEEDS', 'CROP PROTECTION', 'CROP NUTRITION',
    'EQUIPMENTS', 'ORGANIC', 'TAPAS',
  ];

  return (
    <header className="navbar-container">
      {/* ── COMPANY HEADER BAND ──────────────────────────────────── */}
      <div className="company-header-band">
        <div className="company-band-inner">
          <div className="company-logo-block">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" fill="#1b5e20" stroke="#4caf50" strokeWidth="2"/>
              <ellipse cx="26" cy="26" rx="10" ry="22" stroke="#a5d6a7" strokeWidth="1.5" fill="none"/>
              <ellipse cx="26" cy="26" rx="22" ry="10" stroke="#a5d6a7" strokeWidth="1.5" fill="none"/>
              <line x1="4" y1="26" x2="48" y2="26" stroke="#a5d6a7" strokeWidth="1.2"/>
              <line x1="26" y1="4" x2="26" y2="48" stroke="#a5d6a7" strokeWidth="1.2"/>
              <path d="M16 34 Q20 24 26 18 Q32 24 36 34" stroke="#66bb6a" strokeWidth="2" fill="none"/>
              <circle cx="26" cy="18" r="3" fill="#81c784"/>
            </svg>
            <div className="company-text-block">
              <span className="company-name-main">SEMENA HYBRID SEEDS (INDIA) PVT. LTD.</span>
              <span className="company-tagline">Growing with Technology</span>
              <span className="project-subtitle">Agri-Tech-Solution</span>
            </div>
          </div>
          <div className="company-contact-block">
            <span>📞 +091 9518930913</span>
            <span>✉ semena_india@hotmail.com</span>
            <span>🌐 www.semenahybridseeds.com</span>
            <span className="cin-tag">CIN: U52609MH2018PTC303967</span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ROW ─────────────────────────────────────────── */}
      <div className="main-nav">
        <div className="nav-content header-row">

          {/* ✅ ENHANCED SEARCH BAR */}
          <div className="search-section">
            <div className="search-bar-pro">
              <input
                type="text"
                placeholder={isListening ? '🎤 Bol do...' : 'Search seeds, tools, brands, crops...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                style={{ background: isListening ? '#f0fff4' : '#fff' }}
              />

              {/* ✅ Voice Search Button */}
              <button
                onClick={handleVoiceSearch}
                title="Voice Search"
                style={{
                  background: isListening ? '#e53935' : 'transparent',
                  border: 'none',
                  padding: '0 10px',
                  cursor: 'pointer',
                  color: isListening ? '#fff' : '#2e7d32',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: '0.2s',
                  animation: isListening ? 'pulse 1s infinite' : 'none'
                }}
              >
                {isListening ? <MdMicOff /> : <MdMic />}
              </button>

              {/* ✅ Photo Search Button */}
              <button
                onClick={() => {
                  const choice = window.confirm('Camera se photo lena? OK = Camera, Cancel = Gallery');
                  if (choice) cameraInputRef.current?.click();
                  else fileInputRef.current?.click();
                }}
                title="Search by Photo"
                style={{
                  background: photoSearching ? '#ff9800' : 'transparent',
                  border: 'none',
                  padding: '0 10px',
                  cursor: 'pointer',
                  color: photoSearching ? '#fff' : '#2e7d32',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: '0.2s'
                }}
              >
                {photoSearching ? '⏳' : <MdCameraAlt />}
              </button>

              {/* Hidden file inputs */}
              <input ref={fileInputRef} type="file" accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handlePhotoSearch(e.target.files[0])} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
                style={{ display: 'none' }}
                onChange={e => handlePhotoSearch(e.target.files[0])} />

              <button className="search-btn" onClick={handleSearch}>
                <HiOutlineSearch />
              </button>
            </div>

            {/* ✅ Photo preview pill */}
            {photoPreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', padding: '4px 10px', background: '#f0fdf4', borderRadius: '20px', width: 'fit-content', fontSize: '12px', color: '#2e7d32' }}>
                <img src={photoPreview} alt="search" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                {photoSearching ? 'Identifying product...' : 'Photo ready'}
                <button onClick={() => setPhotoPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: '14px' }}>✕</button>
              </div>
            )}
          </div>

          {/* UTILITY GROUP */}
          <div className="utility-group">
            <Link to="/track-order" className="utility-item">
              <MdLocalShipping /><span>Track Order</span>
            </Link>
            <Link to="/wishlist" className="utility-item cart-relative">
              <HiOutlineHeart /><span>Wishlist</span>
              {wishlist?.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
            </Link>
            <Link to="/agribot" className="utility-item ai-link"><span>🤖</span><span>AgriBot</span></Link>
            <Link to="/crop-health" className="utility-item ai-link"><span>🔬</span><span>CropAI</span></Link>
            <Link to="/agritube" className="utility-item tube-link"><span>📹</span><span>AgriTube</span></Link>

            <div className="auth-field-stable">
              <div className="utility-item user-dropdown-parent dropdown-fix">
                <HiOutlineUser />
                {!isLoggedIn ? (
                  <>
                    <span>Login <small>▼</small></span>
                    <div className="auth-dropdown">
                      <Link to="/login">Customer Login</Link>
                      <Link to="/supplier-login">Seller / Farmer Zone</Link>
                      <Link to="/delivery-panel">🚚 Delivery Partner</Link>
                      <Link to="/signup" className="signup-highlight">New? Register Free</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="account-text-active">Account <small>▼</small></span>
                    <div className="auth-dropdown">
                      {userRole === 'customer' && <Link to="/customer-dashboard"><MdDashboard /> Dashboard</Link>}
                      {(userRole === 'supplier' || userRole === 'farmer' || userRole === 'dealer') && <Link to="/supplier-dashboard/home"><MdDashboard /> Seller Panel</Link>}
                      {userRole === 'admin' && <Link to="/admin-dashboard/home"><MdDashboard /> Admin Hub</Link>}
                      <Link to="/profile">👤 My Profile</Link>
                      <hr />
                      <button onClick={handleLogout} className="logout-btn-nav"><MdLogout /> Logout</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="utility-item cart-btn">
              <Link to="/cart" className="util-box cart-relative">
                <HiOutlineShoppingBag /><span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORY NAV ─────────────────────────────────────────── */}
      <nav className="category-nav">
        <div className="nav-content">
          <ul className="nav-menu">
            {mainLinks.map((link) => (
              <li key={link} className={`nav-item ${navData[link] ? 'has-dropdown' : ''}`}>
                {link === 'HOME'
                  ? <Link to="/" className="nav-link-text">{link}</Link>
                  : <span className="nav-link-text">{link}</span>}
                {navData[link] && <span className="dropdown-arrow">▾</span>}
                {navData[link] && (
                  <div className="mega-menu">
                    <div className="mega-menu-inner">
                      {navData[link].map((column, idx) => (
                        <div className="menu-column" key={idx}>
                          <h4 className="column-title">{column.title}</h4>
                          <ul className="column-list">
                            {column.items.map((item) => (
                              <li key={item} className="column-item"><a href="#">{item}</a></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
            <li className="nav-item"><Link to="/agribot" className="nav-link-text ai-nav-link">🤖 AgriBot</Link></li>
            <li className="nav-item"><Link to="/crop-health" className="nav-link-text ai-nav-link">🔬 CropAI</Link></li>
            <li className="nav-item"><Link to="/agritube" className="nav-link-text tube-nav-link">📹 AgriTube</Link></li>
          </ul>
        </div>
      </nav>

      {/* ✅ Pulse animation for mic */}
      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(229,57,53,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(229,57,53,0); }
          100% { box-shadow: 0 0 0 0 rgba(229,57,53,0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;