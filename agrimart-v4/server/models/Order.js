const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  name:     { type: String, required: true },
  qty:      { type: Number, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const orderSchema = mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  
  shippingAddress: {
    address: String,
    city:    String,
    state:   String,
    pincode: String,
    phone:   String,
  },

  paymentMethod:  { type: String, default: 'COD' }, // COD, UPI, Card
  paymentStatus:  { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  
  totalPrice:     { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },

  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  
  trackingId: { type: String, default: '' },
  paidAt:     { type: Date },
  deliveredAt:{ type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
