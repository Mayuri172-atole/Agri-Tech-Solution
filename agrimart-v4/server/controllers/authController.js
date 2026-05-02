const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in .env file');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// POST /api/users/register-customer
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email aur password required hain.' });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Ye email pehle se registered hai.' });

    const user = await User.create({
      name, email, password,
      role: 'customer', isVerified: true, isActive: true, status: 'Approved',
    });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, isVerified: true, token: generateToken(user._id),
    });
  } catch (err) {
    console.error('registerCustomer error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/register-supplier
const registerSupplier = async (req, res) => {
  try {
    const { name, email, password, role, businessName, licenceNo, userCategory } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email aur password required hain.' });

    // ✅ FIX 1: Duplicate licence number check
    if (licenceNo && licenceNo.trim() !== '') {
      const licenceTaken = await User.findOne({ licenceNo: licenceNo.trim() });
      if (licenceTaken) {
        return res.status(400).json({
          message: `Ye licence number (${licenceNo}) pehle se register hai! Agar aapka hai toh admin se contact karo.`
        });
      }
    }

    // ✅ FIX 2: Email already exists checks
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.status === 'Blocked')
        return res.status(403).json({ message: 'Ye account permanently block hai. Admin se contact karo.' });

      // ✅ FIX 3: Rejected dealer dobara register nahi kar sakta
      if (existing.status === 'Rejected' || existing.status === 'Auto-Rejected')
        return res.status(403).json({
          message: 'Aapki application pehle reject ho chuki hai. Naya account banana allowed nahi. Admin se contact karo.'
        });

      if (existing.loginAttempts >= 5) {
        await User.findByIdAndUpdate(existing._id, { status: 'Blocked', isActive: false });
        return res.status(403).json({ message: 'Zyada attempts ki wajah se account block ho gaya.' });
      }

      await User.findByIdAndUpdate(existing._id, { $inc: { loginAttempts: 1 } });
      return res.status(400).json({ message: 'Ye email pehle se registered hai.' });
    }

    const allowedRoles = ['farmer', 'dealer'];
    const finalRole = allowedRoles.includes(role) ? role : 'farmer';
    const isDealer = finalRole === 'dealer';

    const user = await User.create({
      name, email, password,
      role: finalRole,
      businessName: businessName || '',
      licenceNo: licenceNo?.trim() || '',
      userCategory: userCategory || '',
      isVerified: !isDealer,
      isActive: true,
      status: isDealer ? 'Pending' : 'Approved',
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, isVerified: user.isVerified, status: user.status,
      businessName: user.businessName, licenceNo: user.licenceNo,
      token: generateToken(user._id),
      message: isDealer
        ? 'Registration submit ho gayi. Admin approval ka wait karo.'
        : 'Registration successful! Agri-Tech-Solution mein welcome hai.',
    });
  } catch (err) {
    console.error('registerSupplier error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email aur password required hain.' });

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      if (user) await User.findByIdAndUpdate(user._id, { $inc: { loginAttempts: 1 } });
      return res.status(401).json({ message: 'Email ya password galat hai.' });
    }

    // ✅ FIX 4: Blocked check
    if (user.status === 'Blocked' || !user.isActive)
      return res.status(403).json({ message: 'Account block hai. Admin se contact karo.' });

    // ✅ FIX 5: Rejected/Auto-Rejected dealer login completely block
    if (user.status === 'Rejected')
      return res.status(403).json({
        message: 'Aapki dealer application reject ho gayi hai. Admin se contact karo: admin@agrimart.in'
      });

    if (user.status === 'Auto-Rejected')
      return res.status(403).json({
        message: 'Aapka account multiple rejections ki wajah se auto-reject ho gaya. Admin se contact karo.'
      });

    // Pending dealer — login nahi kar sakta
    if (user.role === 'dealer' && user.status === 'Pending')
      return res.status(403).json({ message: 'Dealer account admin approval ka wait kar raha hai.' });

    await User.findByIdAndUpdate(user._id, { loginAttempts: 0 });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, isVerified: user.isVerified, status: user.status,
      businessName: user.businessName, licenceNo: user.licenceNo,
      userCategory: user.userCategory,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('loginUser error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User nahi mila.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/all (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/approve/:id
const approveDealer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, status: 'Approved', isActive: true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User nahi mila.' });
    res.json({ message: `${user.name} approve ho gaya.`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/reject/:id
const rejectDealer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User nahi mila.' });

    const newRejectionCount = user.rejectionCount + 1;
    let newStatus = 'Rejected';
    let isActive = false; // ✅ FIX: Rejected hote hi isActive false — login band

    if (newRejectionCount > 3) { newStatus = 'Auto-Rejected'; isActive = false; }
    if (user.loginAttempts >= 5) { newStatus = 'Blocked'; isActive = false; }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { status: newStatus, rejectionCount: newRejectionCount, isVerified: false, isActive },
      { new: true }
    ).select('-password');

    res.json({ message: `${user.name} ka status ${newStatus} set ho gaya.`, user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/block/:id
const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'Blocked', isActive: false, isVerified: false },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User nahi mila.' });
    res.json({ message: `${user.name} block ho gaya.`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User nahi mila.' });
    res.json({ message: 'User delete ho gaya.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerCustomer, registerSupplier, loginUser,
  getMe, getAllUsers, approveDealer, rejectDealer, blockUser, deleteUser,
};
