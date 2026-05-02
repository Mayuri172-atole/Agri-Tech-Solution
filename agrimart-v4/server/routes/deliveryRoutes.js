const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.JWT_SECRET || 'agrimart_secret';

// Delivery partner JWT protect
const protectDelivery = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, SECRET);
      req.partner = await DeliveryPartner.findById(decoded.id).select('-password');
      next();
    } catch (e) {
      res.status(401).json({ message: 'Token invalid' });
    }
  } else {
    res.status(401).json({ message: 'No token' });
  }
};

// POST /api/delivery/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, vehicle, zone } = req.body;
    const exists = await DeliveryPartner.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const partner = await DeliveryPartner.create({
      name, email: email.toLowerCase(), password: hashedPassword, phone, vehicle, zone
    });
    const token = jwt.sign({ id: partner._id }, SECRET, { expiresIn: '30d' });
    res.status(201).json({ _id: partner._id, name: partner.name, email: partner.email, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/delivery/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const partner = await DeliveryPartner.findOne({ email: email.toLowerCase() });
    if (!partner) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: partner._id }, SECRET, { expiresIn: '30d' });
    res.json({
      _id: partner._id, name: partner.name, email: partner.email,
      phone: partner.phone, vehicle: partner.vehicle, zone: partner.zone, token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/delivery/my-orders
router.get('/my-orders', protectDelivery, async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartnerId: req.partner._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/delivery/orders/:id/status
router.put('/orders/:id/status', protectDelivery, async (req, res) => {
  try {
    const update = { status: req.body.status };
    if (req.body.status === 'Delivered') {
      update.deliveredAt = new Date();
      if (req.body.paymentMethod === 'COD') update.paymentStatus = 'Success';
    }
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.body.status === 'Delivered') {
      await DeliveryPartner.findByIdAndUpdate(req.partner._id, {
        $inc: { totalDeliveries: 1 },
        $pull: { currentOrders: order._id }
      });
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/delivery/profile
router.get('/profile', protectDelivery, async (req, res) => {
  res.json(req.partner);
});

module.exports = router;
