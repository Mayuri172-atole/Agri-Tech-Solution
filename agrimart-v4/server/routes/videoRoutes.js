const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadVideo, getApprovedVideos, getMyVideos, getAllVideos, approveVideo, deleteVideo } = require('../controllers/videoController');

// Multer: video-only storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/videos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const videoFilter = (req, file, cb) => {
  const allowed = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only video files are allowed. Images are not permitted.'), false);
};

const upload = multer({ storage, fileFilter: videoFilter, limits: { fileSize: 500 * 1024 * 1024 } }); // 500MB

// Public
router.get('/', getApprovedVideos);

// Protected
router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/my', protect, getMyVideos);
router.delete('/:id', protect, deleteVideo);

// Admin
router.get('/admin/all', protect, adminOnly, getAllVideos);
router.put('/approve/:id', protect, adminOnly, approveVideo);

module.exports = router;
