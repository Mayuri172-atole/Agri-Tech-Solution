const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  image:       { type: String, default: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400' },
  description: { type: String, default: '' },
  category:    { type: String, required: true }, // Vegetables, Fruits, Grains, Pesticide, Fertilizer, Seeds
  price:       { type: Number, required: true, default: 0 },
  oldPrice:    { type: Number, default: 0 },
  discount:    { type: Number, default: 0 },
  countInStock:{ type: Number, required: true, default: 0 },
  stock:       { type: Number, default: 0 }, // alias for countInStock (frontend uses both)
  brand:       { type: String, default: '' },
  tag:         { type: String, default: '' }, // "Trending Now", "Lowest Price Deal"

  // Role-based type flag - Core logic!
  // 'fresh'    = Farmer produce (Vegetables, Fruits, Grains)
  // 'licensed' = Dealer products (Pesticide, Fertilizer, Tools)
  productType: { type: String, enum: ['fresh', 'licensed'], default: 'fresh' },

  // Admin approval flow for licensed products
  status: { 
    type: String, 
    enum: ['Live', 'Pending Approval', 'Rejected'], 
    default: 'Live' 
  },

  // Dealer-only metadata
  chemicalInfo: { type: String, default: '' }, // Batch No
  expiryDate:   { type: String, default: '' },

  // Seller info
  seller:     { type: String, default: '' }, // email
  sellerName: { type: String, default: '' },

  rating:      { type: Number, default: 4.0 },
  numReviews:  { type: Number, default: 0 },

}, { timestamps: true });

// Text search index
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
