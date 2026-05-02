const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();
connectDB();

const users = [
  { name: 'Admin AgriMart', email: 'admin@agrimart.com', password: 'admin123', role: 'admin', isVerified: true },
  { name: 'Sunita Devi', email: 'farmer@agrimart.com', password: 'test1234', role: 'farmer', isVerified: true },
  { name: 'Manoj Chemicals', email: 'dealer@agrimart.com', password: 'test1234', role: 'dealer', businessName: 'Manoj Agro Inputs', licenceNo: 'MH-LIC-2024', userCategory: 'Pesticide/Fertilizer', isVerified: true },
  { name: 'Ramesh Patil', email: 'customer@agrimart.com', password: 'test1234', role: 'customer', isVerified: true },
];

const products = [
  // FRESH - Farmer
  { name: 'Organic Tomatoes', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', description: 'Farm fresh organic tomatoes. Pesticide-free.', category: 'Vegetables', price: 35, oldPrice: 50, discount: 30, countInStock: 200, stock: 200, brand: 'Sunita Farm', tag: 'Trending Now', productType: 'fresh', status: 'Live', seller: 'farmer@agrimart.com', sellerName: 'Sunita Devi' },
  { name: 'Alphonso Mangoes', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400', description: 'Premium Ratnagiri Hapus mangoes. Sweet and juicy.', category: 'Fruits', price: 250, oldPrice: 350, discount: 29, countInStock: 80, stock: 80, brand: 'Sunita Farm', tag: 'Limited Time Deal', productType: 'fresh', status: 'Live', seller: 'farmer@agrimart.com', sellerName: 'Sunita Devi' },
  { name: 'Basmati Rice (5kg)', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Premium long grain basmati. Freshly harvested.', category: 'Grains', price: 420, oldPrice: 550, discount: 24, countInStock: 150, stock: 150, brand: 'Sunita Farm', tag: 'Lowest Price Deal', productType: 'fresh', status: 'Live', seller: 'farmer@agrimart.com', sellerName: 'Sunita Devi' },
  { name: 'Fresh Spinach (1kg)', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Tender farm fresh spinach leaves.', category: 'Vegetables', price: 30, oldPrice: 45, discount: 33, countInStock: 300, stock: 300, brand: 'Sunita Farm', tag: 'Trending Now', productType: 'fresh', status: 'Live', seller: 'farmer@agrimart.com', sellerName: 'Sunita Devi' },
  // LICENSED - Dealer
  { name: 'NPK 19-19-19 Fertilizer (1kg)', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400', description: 'Water soluble fertilizer for all crops. Balanced nutrition.', category: 'Fertilizer', price: 343, oldPrice: 664, discount: 48, countInStock: 100, stock: 100, brand: 'Katyayani Organics', tag: 'Lowest Price Deal', productType: 'licensed', status: 'Live', chemicalInfo: 'KO-BATCH-2024', expiryDate: '2026-12-31', seller: 'dealer@agrimart.com', sellerName: 'Manoj Chemicals' },
  { name: 'Neem-Based Pesticide Spray (250ml)', image: 'https://images.unsplash.com/photo-1563514227147-6d2af6a399fd?w=400', description: 'Organic neem oil based pesticide. Safe for all crops.', category: 'Pesticide', price: 271, oldPrice: 700, discount: 61, countInStock: 75, stock: 75, brand: 'Geolife Agritech', tag: 'Trending Now', productType: 'licensed', status: 'Live', chemicalInfo: 'GEO-BATCH-2024', expiryDate: '2026-06-30', seller: 'dealer@agrimart.com', sellerName: 'Manoj Chemicals' },
  { name: 'Hybrid Tomato Seeds (3500 seeds)', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', description: 'High yield hybrid seeds by Syngenta. 90-day maturity.', category: 'Seeds', price: 953, oldPrice: 1525, discount: 38, countInStock: 200, stock: 200, brand: 'Syngenta', tag: 'Limited Time Deal', productType: 'licensed', status: 'Live', chemicalInfo: 'SYN-BATCH-2024', expiryDate: '2025-12-31', seller: 'dealer@agrimart.com', sellerName: 'Manoj Chemicals' },
  { name: 'Battery Sprayer 12L', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400', description: 'Tapas Pahalwaan 101. Powerful motor, 12L tank.', category: 'Tools', price: 2549, oldPrice: 4999, discount: 49, countInStock: 30, stock: 30, brand: 'Tapas', tag: 'Lowest Price Deal', productType: 'licensed', status: 'Live', chemicalInfo: 'TAP-BATCH-2024', expiryDate: '2030-01-01', seller: 'dealer@agrimart.com', sellerName: 'Manoj Chemicals' },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    // Hash passwords manually (pre-save hook won't run with insertMany)
    const hashedUsers = await Promise.all(users.map(async u => ({
      ...u, password: await bcrypt.hash(u.password, 12)
    })));

    await User.insertMany(hashedUsers);
    await Product.insertMany(products);

    console.log('✅ Demo Data Import Ho Gaya!'.green.inverse);
    console.log('\n📧 Test Accounts:'.yellow);
    console.log('  Admin   : admin@agrimart.com    / admin123'.cyan);
    console.log('  Farmer  : farmer@agrimart.com   / test1234'.cyan);
    console.log('  Dealer  : dealer@agrimart.com   / test1234'.cyan);
    console.log('  Customer: customer@agrimart.com / test1234'.cyan);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

importData();
