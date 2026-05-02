const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  mobile:   { type: String, unique: true, sparse: true, default: null },
  password: { type: String, required: true },
  role:     { type: String, enum: ['customer', 'farmer', 'dealer', 'admin'], default: 'customer' },

  businessName:  { type: String, default: '' },
  licenceNo:     { type: String, default: '' },
  userCategory:  { type: String, default: '' },

  isVerified:    { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
  status:        { type: String, default: 'Pending' },
  rejectionCount:{ type: Number, default: 0 },
  loginAttempts: { type: Number, default: 0 },

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

// ✅ FIX: next() bilkul mat likho — Express v4/v5 dono mein crash karta tha
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
