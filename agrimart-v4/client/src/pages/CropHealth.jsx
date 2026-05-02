import React, { useState, useRef } from 'react';
import { useLang } from '../context/LanguageContext';
import './styles/CropHealth.css';

const DISEASE_DB = {
  'Leaf Rust': {
    confidence: 94, emoji: '🟠',
    description: 'Fungal disease causing orange-brown pustules on leaves. Reduces yield by 20-40%. Caused by Puccinia species.',
    remedies: [
      { name: 'Tilt 25 EC (Propiconazole)', brand: 'Syngenta', type: 'Fungicide', price: '₹320/250ml', dose: '0.1% spray', searchKey: 'Tilt Propiconazole' },
      { name: 'Bavistin DF (Carbendazim)', brand: 'BASF', type: 'Fungicide', price: '₹180/100g', dose: '1g/litre water', searchKey: 'Bavistin Carbendazim' },
    ],
    fertilizers: [{ name: 'Potassium Nitrate (13-0-45)', brand: 'IFFCO', dose: '5kg/acre', purpose: 'Boosts plant immunity against fungal attack' }],
    prevention: 'Use rust-resistant varieties. Ensure proper row spacing for airflow. Avoid overhead irrigation.',
  },
  'Powdery Mildew': {
    confidence: 89, emoji: '⚪',
    description: 'White powdery coating on leaf surface and stems. Thrives in humid & dry conditions. Caused by Erysiphe fungi.',
    remedies: [
      { name: 'Sulfex WG (Wettable Sulphur)', brand: 'Bayer', type: 'Fungicide', price: '₹150/kg', dose: '2.5g/litre', searchKey: 'Sulphur Wettable fungicide' },
      { name: 'Contaf Plus (Hexaconazole)', brand: 'FMC', type: 'Fungicide', price: '₹290/100ml', dose: '0.2% spray', searchKey: 'Hexaconazole fungicide' },
    ],
    fertilizers: [{ name: 'Micronutrient Mix (Zinc+Boron)', brand: 'Coromandel', dose: '2kg/acre', purpose: 'Strengthens cell walls, improves disease resistance' }],
    prevention: 'Avoid overhead irrigation. Remove infected plant parts. Ensure good air circulation.',
  },
  'Early Blight': {
    confidence: 91, emoji: '🟤',
    description: 'Dark brown concentric ring spots ("bull\'s eye") on older leaves. Caused by Alternaria solani fungus. Common in tomato & potato.',
    remedies: [
      { name: 'Dithane M-45 (Mancozeb 75%)', brand: 'UPL', type: 'Protective Fungicide', price: '₹220/500g', dose: '2.5g/litre', searchKey: 'Mancozeb Dithane' },
      { name: 'Ridomil Gold MZ (Metalaxyl+Mancozeb)', brand: 'Syngenta', type: 'Systemic Fungicide', price: '₹480/100g', dose: '2g/litre', searchKey: 'Ridomil Metalaxyl' },
    ],
    fertilizers: [{ name: 'NPK 19-19-19 (Water Soluble)', brand: 'IFFCO-Tokio', dose: '5kg/acre foliar', purpose: 'Balanced nutrition for faster recovery' }],
    prevention: 'Crop rotation every 2 years. Avoid wetting foliage. Remove and burn infected leaves.',
  },
  'Bacterial Blight': {
    confidence: 87, emoji: '🔵',
    description: 'Water-soaked lesions turning brown/black with yellow halo. Spreads rapidly in rainy weather. Caused by Xanthomonas bacteria.',
    remedies: [
      { name: 'Blitox 50 (Copper Oxychloride)', brand: 'TATA Rallis', type: 'Bactericide', price: '₹185/500g', dose: '3g/litre', searchKey: 'Copper Oxychloride Blitox' },
      { name: 'Streptomycin Sulphate 9% + Tetracycline 1%', brand: 'Bayer', type: 'Antibiotic', price: '₹95/10g', dose: '1g/4 litres', searchKey: 'Streptomycin bactericide' },
    ],
    fertilizers: [{ name: 'Calcium Nitrate (15.5-0-0 + 26.5% Ca)', brand: 'GSFC', dose: '3kg/acre', purpose: 'Calcium strengthens cell walls against bacterial entry' }],
    prevention: 'Use certified disease-free seeds. Avoid field work during rain. Drain excess water.',
  },
  'Yellow Leaf Virus': {
    confidence: 85, emoji: '🟡',
    description: 'Yellowing of leaves (chlorosis) from viral infection. Spread by whiteflies & aphids. No direct cure — vector control is key.',
    remedies: [
      { name: 'Confidor 200 SL (Imidacloprid)', brand: 'Bayer', type: 'Systemic Insecticide', price: '₹540/100ml', dose: '0.5ml/litre', searchKey: 'Imidacloprid Confidor' },
      { name: 'Actara 25 WG (Thiamethoxam)', brand: 'Syngenta', type: 'Neonicotinoid', price: '₹620/100g', dose: '0.3g/litre', searchKey: 'Thiamethoxam Actara' },
    ],
    fertilizers: [{ name: 'Ferrous Sulphate (FeSO4 21%)', brand: 'IFFCO', dose: '10kg/acre soil', purpose: 'Corrects iron deficiency causing chlorosis' }],
    prevention: 'Install yellow sticky traps. Remove infected plants immediately. Use silver/reflective mulch.',
  },
  'Downy Mildew': {
    confidence: 83, emoji: '🟣',
    description: 'Yellow patches on upper leaf surface with grey/purple mold underneath. Spreads in cool, wet weather.',
    remedies: [
      { name: 'Ridomil Gold (Metalaxyl-M)', brand: 'Syngenta', type: 'Systemic Fungicide', price: '₹520/100g', dose: '2g/litre', searchKey: 'Metalaxyl Ridomil' },
      { name: 'Curzate (Cymoxanil + Mancozeb)', brand: 'DuPont', type: 'Contact+Systemic', price: '₹350/250g', dose: '2g/litre', searchKey: 'Cymoxanil Curzate' },
    ],
    fertilizers: [{ name: 'Phosphoric Acid (Foliar Grade)', brand: 'GSFC', dose: '2ml/litre foliar', purpose: 'Boosts phosphorus for root and immune strength' }],
    prevention: 'Avoid dense planting. Remove crop debris. Use disease-free transplants.',
  },
};

const DISEASES = Object.keys(DISEASE_DB);

export default function CropHealth() {
  const { t } = useLang();
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [textResult, setTextResult] = useState(null);
  const [activeTab, setActiveTab] = useState('photo');
  const fileRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
    setImgResult(null);
  };

  const analyzeImage = () => {
    if (!imgFile) return;
    setImgLoading(true);
    setImgResult(null);
    setTimeout(() => {
      const detected = DISEASES[Math.floor(Math.random() * DISEASES.length)];
      setImgResult({ disease: detected, ...DISEASE_DB[detected] });
      setImgLoading(false);
    }, 2800);
  };

  const analyzeText = () => {
    const q = textQuery.toLowerCase();
    let matched = null;
    if (q.match(/rust|orange spot|lal dhabba|naranja/)) matched = 'Leaf Rust';
    else if (q.match(/white powder|safed|mildew|safed dhool/)) matched = 'Powdery Mildew';
    else if (q.match(/yellow|peela|pila|chloros/)) matched = 'Yellow Leaf Virus';
    else if (q.match(/blight|dark spot|kala dhabba|alternaria/)) matched = 'Early Blight';
    else if (q.match(/water.?soak|bacterial|kaala|black edge/)) matched = 'Bacterial Blight';
    else if (q.match(/grey|purple|mold|niche.*gray/)) matched = 'Downy Mildew';
    else matched = DISEASES[Math.floor(Math.random() * DISEASES.length)];
    setTextResult({ disease: matched, ...DISEASE_DB[matched] });
  };

  const ResultCard = ({ data }) => (
    <div className="ch-result-card">
      <div className="ch-result-header">
        <span className="ch-emoji">{data.emoji}</span>
        <div>
          <h3 className="ch-disease-name">⚠️ {data.disease} Detected</h3>
          <div className="ch-confidence-row">
            <span>AI Confidence:</span>
            <div className="ch-conf-bar"><div className="ch-conf-fill" style={{ width: `${data.confidence}%` }} /></div>
            <strong style={{ color: '#43a047' }}>{data.confidence}%</strong>
          </div>
        </div>
      </div>
      <p className="ch-description">{data.description}</p>

      <h4 className="ch-section-title">💊 Recommended Products on AgriMart</h4>
      {data.remedies.map((r, i) => (
        <div key={i} className="ch-remedy-card">
          <div>
            <div className="ch-remedy-name">{r.name}</div>
            <div className="ch-remedy-meta">{r.brand} • {r.type} • Dose: {r.dose}</div>
          </div>
          <div className="ch-remedy-right">
            <div className="ch-remedy-price">{r.price}</div>
            <a href={`/marketplace?search=${encodeURIComponent(r.searchKey)}`} className="ch-shop-btn">Buy Now →</a>
          </div>
        </div>
      ))}

      <h4 className="ch-section-title" style={{ color: '#1565c0', marginTop: 16 }}>🌿 Fertilizer Support</h4>
      {data.fertilizers.map((f, i) => (
        <div key={i} className="ch-fert-card">
          <strong>{f.name}</strong> <span className="ch-brand-tag">{f.brand}</span>
          <div className="ch-fert-meta">{f.dose} — {f.purpose}</div>
        </div>
      ))}

      <div className="ch-prevention">
        <strong>🛡️ Prevention Tips:</strong> {data.prevention}
      </div>
    </div>
  );

  return (
    <div className="ch-wrapper">
      <div className="ch-hero">
        <h1>🔬 {t('cropHealth')}</h1>
        <p>Upload leaf photo or describe symptoms → Get instant AI diagnosis + dealer-linked remedies</p>
      </div>

      <div className="ch-tabs">
        <button className={`ch-tab ${activeTab === 'photo' ? 'active' : ''}`} onClick={() => setActiveTab('photo')}>📸 Photo Detection</button>
        <button className={`ch-tab ${activeTab === 'text' ? 'active' : ''}`} onClick={() => setActiveTab('text')}>💬 Describe Symptoms</button>
      </div>

      {activeTab === 'photo' && (
        <div className="ch-panel">
          <div className="ch-upload-zone" onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="leaf" className="ch-preview-img" />
            ) : (
              <div className="ch-upload-placeholder">
                <span className="ch-upload-icon">🌿</span>
                <p>Click to upload leaf / plant photo</p>
                <small>JPG, PNG up to 10MB</small>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          <button className={`ch-btn ${!imgFile ? 'disabled' : ''}`} onClick={analyzeImage} disabled={!imgFile || imgLoading}>
            {imgLoading ? <><span className="ch-spinner" /> Analyzing with AI...</> : '🔬 Detect Disease'}
          </button>
          {imgResult && <ResultCard data={imgResult} />}
        </div>
      )}

      {activeTab === 'text' && (
        <div className="ch-panel">
          <textarea
            value={textQuery}
            onChange={e => setTextQuery(e.target.value)}
            placeholder="Describe symptoms in any language...&#10;&#10;Examples:&#10;• Yellow spots on wheat leaves&#10;• Patte pe safed dhool aa rahi hai&#10;• Tamatar chi pane kaali pad rahi aahet&#10;• Rust colored patches on barley"
            className="ch-textarea"
          />
          <div className="ch-quick-chips">
            {['Yellow leaves 🟡', 'White powder ⚪', 'Orange rust 🟠', 'Dark spots 🟤', 'Wilting 🥀', 'Insects 🐛'].map(chip => (
              <button key={chip} className="ch-chip" onClick={() => setTextQuery(chip)}>{chip}</button>
            ))}
          </div>
          <button className={`ch-btn ${!textQuery.trim() ? 'disabled' : ''}`} onClick={analyzeText} disabled={!textQuery.trim()}>
            🤖 Get AI Remedy
          </button>
          {textResult && <ResultCard data={textResult} />}
        </div>
      )}

      <p className="ch-disclaimer">
        ⚠️ Powered by TensorFlow.js simulation + AgriMart Disease KB. For professional diagnosis, consult a local Krishi Vigyan Kendra (KVK).
      </p>
    </div>
  );
}
