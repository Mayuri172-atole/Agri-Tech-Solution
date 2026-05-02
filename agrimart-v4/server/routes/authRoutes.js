const express = require('express');
const router = express.Router();
const {
  registerCustomer, registerSupplier, loginUser,
  getMe, getAllUsers, approveDealer, rejectDealer, blockUser, deleteUser
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((err) => res.status(500).json({ message: err.message }));

router.post('/register-customer', wrap(registerCustomer));
router.post('/register-supplier', wrap(registerSupplier));
router.post('/login',             wrap(loginUser));
router.get('/me',                 protect, wrap(getMe));
router.get('/all',                protect, adminOnly, wrap(getAllUsers));
router.put('/approve/:id',        protect, adminOnly, wrap(approveDealer));
router.put('/reject/:id',         protect, adminOnly, wrap(rejectDealer));
router.put('/block/:id',          protect, adminOnly, wrap(blockUser));
router.delete('/user/:id',        protect, adminOnly, wrap(deleteUser));

// Wishlist routes
const User = require('../models/User');
router.get('/wishlist',                   protect, async (req, res) => { try { const u = await User.findById(req.user._id).populate('wishlist'); res.json(u.wishlist || []); } catch(e) { res.status(500).json({message:e.message}); } });
router.post('/wishlist/add',              protect, async (req, res) => { try { const u = await User.findById(req.user._id); if (!u.wishlist.includes(req.body.productId)) { u.wishlist.push(req.body.productId); await u.save(); } res.json({message:'Added'}); } catch(e) { res.status(500).json({message:e.message}); } });
router.delete('/wishlist/remove/:pid',    protect, async (req, res) => { try { await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.pid } }); res.json({message:'Removed'}); } catch(e) { res.status(500).json({message:e.message}); } });

module.exports = router;
