const mongoose = require('mongoose');

const deliveryPartnerSchema = mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String, required: true },
  vehicle:  { type: String, default: 'Bike' },
  zone:     { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  currentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  totalDeliveries: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
