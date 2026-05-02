const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmationEmail, sendSellerNotificationEmail } = require('../utils/emailService');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, deliveryCharge } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'Cart khali hai!' });

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalPrice,
      deliveryCharge: deliveryCharge || 0,
      trackingId: 'AM' + Date.now(),
    });

    const saved = await order.save();

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty, stock: -item.qty }
      });
    }

    // Send emails (non-blocking)
    try {
      const user = await User.findById(req.user._id).select('name email mobile');
      if (user && user.email) {
        await sendOrderConfirmationEmail(saved, user.email, user.name);
        for (const item of orderItems) {
          const product = await Product.findById(item.product).select('seller sellerName');
          if (product && product.seller) {
            await sendSellerNotificationEmail(saved, product.seller, product.sellerName || 'Seller', item);
          }
        }
      }
    } catch (emailErr) {
      console.log('Email failed (non-critical): ' + emailErr.message);
    }

    // WhatsApp/SMS via Twilio (uncomment when Twilio ready)
    // try {
    //   const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    //   const user = await User.findById(req.user._id).select('mobile');
    //   if (user && user.mobile) {
    //     // SMS
    //     await twilio.messages.create({
    //       body: 'AgriMart: Order confirmed! ID: #' + saved._id + '. Track at agrimart.com',
    //       from: process.env.TWILIO_FROM,
    //       to: '+91' + user.mobile
    //     });
    //     // WhatsApp
    //     await twilio.messages.create({
    //       body: 'AgriMart Order Confirmed!\nOrder ID: #' + saved._id + '\nTotal: Rs.' + saved.totalPrice + '\nThank you for shopping!',
    //       from: process.env.TWILIO_WHATSAPP_FROM,
    //       to: 'whatsapp:+91' + user.mobile
    //     });
    //   }
    // } catch (smsErr) { console.log('SMS/WhatsApp failed: ' + smsErr.message); }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email mobile').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order nahi mila!' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order nahi mila!' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus };
