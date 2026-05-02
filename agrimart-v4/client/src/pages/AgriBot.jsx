import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import './styles/AgriBot.css';

const KB = [
  { kw:['yellow','yellowing','peela','pila','chlorosis','pivla','pilya'], res:"🌿 **Yellow Leaves — Possible Causes:**\n\n1. **Nitrogen Deficiency** → Apply Urea (5kg/acre) or IFFCO DAP\n2. **Iron Deficiency** → Ferrous Sulphate 10kg/acre soil application\n3. **Yellow Leaf Virus** → Use Imidacloprid to control whitefly vectors\n4. **Waterlogging** → Improve field drainage\n\n🛒 Shop: IFFCO Urea, Coromandel DAP available in our Fertilizer section!\n👉 Or use Crop Health AI → Upload photo for accurate diagnosis", cat:'Fertilizer' },
  { kw:['rust','orange','lal dhabba','orange spot','gerua'], res:"🔴 **Leaf Rust Detected by Description!**\n\n**Immediate Spray (within 24 hrs):**\n- **Tilt 25 EC** (Syngenta, Propiconazole) @ 0.1% — ₹320/250ml\n- **Bavistin DF** (BASF, Carbendazim) @ 1g/litre\n\n**Fertilizer:** Potassium Nitrate (5kg/acre) boosts immunity.\n\n⚠️ Spray at flag leaf stage for wheat rust.\n🛒 Search 'Propiconazole' in our Pesticide section!", cat:'Pesticide' },
  { kw:['white powder','safed dhool','mildew','safed','powdery'], res:"⚪ **Powdery Mildew Identified!**\n\n**Treatment Options:**\n- **Sulfex WG** (Bayer, Wettable Sulphur) @ 2.5g/L — ₹150/kg\n- **Contaf Plus** (FMC, Hexaconazole) @ 0.2% spray\n\n💡 Spray in early morning. Do not mix with oil-based sprays.\n🛒 Search 'Sulphur fungicide' in marketplace!", cat:'Pesticide' },
  { kw:['wilt','wilting','droop','sukh','murjha','fade'], res:"🥀 **Wilting Plants — Diagnosis:**\n\n1. **Water Stress** → Irrigate immediately, check soil moisture\n2. **Fusarium Wilt** → Bavistin 2g/L soil drench\n3. **Root Rot** → Ridomil Gold (Syngenta) 2g/L\n4. **Stem Borer** → Coragen 0.4ml/L\n\n💡 Check: Is soil sticky/waterlogged? Improve drainage first!\n🛒 Ridomil & Bavistin available in Pesticide section.", cat:'Pesticide' },
  { kw:['insect','pest','kida','kirmi','aphid','caterpillar','sucker','whitefly'], res:"🐛 **Pest Attack Remedies:**\n\n**For Sucking Pests (Aphids, Whitefly, Thrips):**\n- **Confidor 200 SL** (Bayer, Imidacloprid) @ 0.5ml/L — ₹540/100ml\n- **Actara 25 WG** (Syngenta, Thiamethoxam) @ 0.3g/L\n\n**For Chewing Pests (Caterpillar, Stem Borer):**\n- **Coragen 20 SC** (FMC, Chlorantraniliprole) @ 0.4ml/L — ₹850/150ml\n- **Delegate WG** (Dow) @ 0.5g/L\n\n🛒 Search 'Insecticide' in AgriMart!", cat:'Pesticide' },
  { kw:['growth','slow growth','height','seedling','bdhna','weak','chhota'], res:"📈 **Poor Growth Solutions:**\n\n1. **DAP (18-46-0)** — Phosphorus for root development, 50kg/acre basal\n2. **NPK 19-19-19** — Foliar spray 5g/L for quick recovery\n3. **Humic Acid + Fulvic** — Improves nutrient uptake organically\n4. **Seaweed Extract** — Natural growth promoter\n\n💡 Check soil pH (ideal: 6.0-7.0). Acidic soil locks nutrients!\n🛒 IFFCO DAP & Coromandel NPK in Fertilizer section!", cat:'Fertilizer' },
  { kw:['seed','beej','germination','ugna','uga','sprouting'], res:"🌱 **Seed & Germination Guide:**\n\n**Seed Treatment Before Sowing:**\n1. **Thiram 75 WS** (3g/kg) — Prevents seed rot & damping off\n2. **Carbendazim** (2g/kg) — Systemic fungal protection\n3. **Rhizobium Culture** — For legumes (natural nitrogen fixing!)\n4. **Trichoderma** — Biological seed treatment\n\n**Germination Tips:**\n- Soil temp: 20-30°C optimal\n- Moisture: 60-70% field capacity\n- Depth: 2-3x seed diameter\n\n🛒 Certified hybrid seeds from Mahyco, Pioneer, Bayer in Seeds section!", cat:'Seeds' },
  { kw:['fertilizer','khad','urea','dap','npk','nutrition','poshan'], res:"🌿 **Complete Fertilizer Guide:**\n\n**Macronutrients:**\n- **Urea (46% N):** Top-dressing, 25-50kg/acre at tillering\n- **DAP (18-46-0):** Basal before sowing — best for root development\n- **MOP (60% K₂O):** Fruit quality & drought resistance\n\n**Micronutrients:**\n- **Zinc Sulphate:** 10kg/acre if yellowing on young leaves\n- **Boron:** 1g/L foliar for flowering crops\n- **Magnesium Sulphate:** 20kg/acre for photosynthesis\n\n💡 Split Urea in 2-3 doses for 30% better efficiency!\n🛒 IFFCO, Coromandel, GSFC brands available!", cat:'Fertilizer' },
  { kw:['irrigation','pani','water','drip','sprinkler','sinchaan'], res:"💧 **Smart Irrigation Guide:**\n\n**Drip Irrigation Benefits:**\n- 50-60% water saving vs flood irrigation\n- Reduces fungal diseases (no wet foliage)\n- Can be combined with fertigation\n\n**Critical Irrigation Stages:**\n- Sowing → Germination\n- Tillering → Crown root initiation\n- Flowering → Seed filling\n\n**General Rule:** 1 inch/week for most crops. Avoid evening watering!\n\n🛒 Drip pipes, sprinkler systems available in Equipment section!", cat:'Equipment' },
  { kw:['tomato','tamatar','tamata'], res:"🍅 **Tomato Complete Care:**\n\n**Common Issues:**\n- Leaf curl → Whitefly/Virus → Imidacloprid 0.5ml/L\n- Blossom drop → Boron deficiency → Solubor 1g/L\n- Fruit cracking → Irregular water + Calcium Nitrate 3g/L\n- Early blight → Dithane M-45 2.5g/L\n\n**Nutrition Schedule:**\n- 0-30 days: DAP + Urea (vegetative)\n- 30-60 days: NPK 13-0-46 (fruiting)\n- Foliar: Micronutrients every 15 days\n\n🛒 All tomato inputs available in marketplace!", cat:'Fertilizer' },
  { kw:['wheat','gehu','gahu','gehun'], res:"🌾 **Wheat Crop Guide:**\n\n**Disease Management:**\n- Crown Root Rot → Bavistin 2g seed treatment\n- Yellow/Brown Rust → Tilt 25 EC @ 0.1% at flag leaf\n- Aphids → Imidacloprid 17.8% SL @ 125ml/acre\n- Karnal Bunt → Propiconazole 0.1%\n\n**Nutrition Schedule:**\n- Basal: DAP 50kg + MOP 25kg\n- 1st Top Dress (CRI): Urea 35kg + ZnSO4 10kg\n- 2nd Top Dress (Tillering): Urea 30kg\n\n🛒 All wheat inputs available in marketplace!", cat:'Fertilizer' },
  { kw:['rice','paddy','dhan','chawal','bhat'], res:"🌾 **Paddy/Rice Guide:**\n\n**Key Diseases:**\n- Blast → Tricyclazole 0.6g/L (Beam)\n- Sheath Blight → Hexaconazole 0.2%\n- BLB → Copper Oxychloride 3g/L\n- Brown Plant Hopper → Buprofezin 0.6ml/L\n\n**Nutrition:**\n- Basal: DAP 50kg + MOP 30kg + ZnSO4 10kg\n- At tillering: Urea 40kg\n- Panicle initiation: Urea 25kg + MOP 15kg\n\n🛒 All paddy inputs available!", cat:'Fertilizer' },
  { kw:['organic','jaivik','natural','bio'], res:"🌿 **Organic Farming Solutions:**\n\n**Bio-Pesticides:**\n- Neem Oil 1500 ppm → 5ml/L for most pests\n- Beauveria bassiana → Soil insect control\n- Trichoderma viride → Soil disease control\n\n**Bio-Fertilizers:**\n- Rhizobium (legumes) → N-fixing\n- Azotobacter → Free-living N-fixation\n- PSB → Phosphate solubilization\n- Vermicompost → 5 tons/acre\n\n🌱 Certified organic inputs available in our Organic section!", cat:'Organic' },
];

const SUGGESTIONS = [
  "Yellow spots on wheat 🌾", "White powder on leaves 🍃", "Plant wilting 🥀",
  "Insects on crop 🐛", "Seeds not germinating 🌱", "Rust on paddy 🔴",
  "Tomato care guide 🍅", "Organic farming help 🌿", "NPK fertilizer dose 💊",
];

export default function AgriBot() {
  const { t } = useLang();
  const [msgs, setMsgs] = useState([{
    from:'bot',
    text:"🌾 **Namaste Kisan ji! Main AgriBot hoon!** 🤖\n\nMujhe apni fasal ki samasya batao — main:\n✅ Sahi fertilizer suggest karunga\n✅ Pesticide recommend karunga\n✅ Certified dealer products dikhaunga\n\nAap **Hindi, Marathi, ya English** mein pooch sakte hain! 🙏",
    time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, typing]);

  const getResp = (q) => {
    const lower = q.toLowerCase();
    for (const item of KB) {
      if (item.kw.some(k => lower.includes(k))) return item.res;
    }
    return `🤔 **Samajh raha hoon "${q}" ke baare mein...**\n\nThoda aur detail do:\n- Kaun si **fasal** (wheat, rice, tomato...)?\n- Kaun sa **hissa** affected (leaves, stem, root)?\n- Kab se? Kitni **%** plants affected?\n\nYa seedha **📸 Crop Health AI** mein photo upload karo accurate diagnosis ke liye!\n\n👉 /crop-health pe jao`;
  };

  const sendMsg = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    const time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    setMsgs(prev => [...prev, { from:'user', text:msg, time }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(prev => [...prev, { from:'bot', text: getResp(msg), time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }]);
      setTyping(false);
    }, 1000 + Math.random()*700);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} style={{ marginBottom: line === '' ? 6 : 1 }}>
          {parts.map((p, j) => p.startsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p)}
        </div>
      );
    });
  };

  return (
    <div className="ab-wrapper">
      <div className="ab-header">
        <div className="ab-avatar">🤖</div>
        <div className="ab-header-info">
          <h2>AgriBot</h2>
          <span className="ab-status">● Online — AI Farm Assistant</span>
        </div>
        <a href="/crop-health" className="ab-detect-btn">📸 Disease AI</a>
      </div>

      <div className="ab-messages">
        {msgs.map((m, i) => (
          <div key={i} className={`ab-msg-row ${m.from}`}>
            {m.from === 'bot' && <div className="ab-bot-icon">🤖</div>}
            <div className={`ab-bubble ${m.from}`}>
              <div className="ab-text">{renderText(m.text)}</div>
              <div className="ab-time">{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="ab-msg-row bot">
            <div className="ab-bot-icon">🤖</div>
            <div className="ab-bubble bot">
              <div className="ab-typing"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="ab-suggestions">
        {SUGGESTIONS.map((s,i) => (
          <button key={i} className="ab-chip" onClick={() => sendMsg(s)}>{s}</button>
        ))}
      </div>

      <div className="ab-input-row">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && sendMsg()}
          placeholder="Apni fasal ki problem batao... Hindi/English/Marathi"
          className="ab-input"
        />
        <button className="ab-send" onClick={() => sendMsg()}>➤</button>
      </div>
    </div>
  );
}
