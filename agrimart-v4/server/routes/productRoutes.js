const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const {
  getProducts, getProductById, createProduct,
  updateProduct, approveProduct, deleteProduct, getMyProducts
} = require('../controllers/productController');
const { protect, adminOnly, supplierOnly } = require('../middleware/authMiddleware');

// ✅ Multer image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/images/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    allowed.test(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, WEBP allowed!'));
  }
});

// Image upload (before /:id)
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ imageUrl: `http://localhost:5000/uploads/images/${req.file.filename}` });
});

// ✅ My products route (before /:id)
router.get('/my-products', protect, getMyProducts);

// Public
router.get('/',    getProducts);
router.get('/:id', getProductById);

// Supplier
router.post('/', createProduct);

// Protected
router.put('/:id/approve', protect, adminOnly,    approveProduct);
router.put('/:id',         protect, supplierOnly,  updateProduct);
router.delete('/:id',      protect, supplierOnly,  deleteProduct);

module.exports = router;