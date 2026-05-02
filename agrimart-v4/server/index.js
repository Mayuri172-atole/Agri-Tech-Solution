const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const videoDir = path.join(__dirname, 'public/uploads/videos');
const imageDir = path.join(__dirname, 'public/uploads/images');
if (!fs.existsSync(videoDir)) { fs.mkdirSync(videoDir, { recursive: true }); }
if (!fs.existsSync(imageDir)) { fs.mkdirSync(imageDir, { recursive: true }); }

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/whatsapp', require('./routes/whatsapp'));

// ✅ Gemini AI Proxy Route (FREE)
app.post('/api/claude', async (req, res) => {
  try {
    // Image ya text message extract karo
    const userContent = req.body.messages?.[0]?.content;
    let parts = [];

    if (Array.isArray(userContent)) {
      // Photo search — image + text dono
      userContent.forEach(item => {
        if (item.type === 'text') {
          parts.push({ text: item.text });
        } else if (item.type === 'image') {
          parts.push({
            inline_data: {
              mime_type: item.source?.media_type || 'image/jpeg',
              data: item.source?.data
            }
          });
        }
      });
    } else {
      // Simple text
      parts.push({ text: userContent });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Koi result nahi mila';

    // Claude jaisa response format — frontend change nahi karna padega
    res.json({ content: [{ type: 'text', text }] });

  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Gemini API failed' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('AgriMart running on port ' + PORT));