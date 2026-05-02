const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User nahi mila.' });
      if (!req.user.isActive || req.user.status === 'Blocked')
        return res.status(403).json({ message: 'Account block hai. Admin se contact karo.' });
      return next();
    } catch (err) {
      console.error('Auth token error:', err.message);
      return res.status(401).json({ message: 'Token invalid ya expire ho gaya.' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization nahi hai. Token do.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access chahiye.' });
};

// ✅ FIX: supplierOnly add kiya - productRoutes.js import karta tha but export missing tha
const supplierOnly = (req, res, next) => {
  if (req.user && ['farmer', 'dealer', 'admin'].includes(req.user.role)) return next();
  return res.status(403).json({ message: 'Supplier/Farmer access chahiye.' });
};

module.exports = { protect, adminOnly, supplierOnly };
