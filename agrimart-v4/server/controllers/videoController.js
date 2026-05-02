const Video = require('../models/Video');
const path = require('path');
const fs = require('fs');

// POST /api/videos/upload
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No video file provided.' });

    const { title, description, category } = req.body;
    if (!title || !category) return res.status(400).json({ message: 'Title and Category are required.' });

    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const video = await Video.create({
      title,
      description: description || '',
      category,
      videoUrl,
      videoKey: req.file.filename,
      uploader: req.user._id,
      uploaderRole: req.user.role,
      isApproved: req.user.role === 'admin', // Admin uploads auto-approved
    });

    res.status(201).json({ message: 'Video uploaded successfully. Pending admin approval.', video });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/videos (public feed — approved only)
const getApprovedVideos = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isApproved: true };
    if (category && category !== 'All') filter.category = category;

    const videos = await Video.find(filter)
      .populate('uploader', 'name role businessName')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/videos/my — logged-in user's own uploads
const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ uploader: req.user._id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/videos/admin/all (Admin — all videos)
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate('uploader', 'name email role')
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/videos/approve/:id (Admin)
const approveVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    res.json({ message: 'Video approved.', video });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/videos/:id (Admin or owner)
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });

    const isOwner = video.uploader.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized.' });

    // Remove file from disk
    const filePath = path.join(__dirname, '..', 'public', video.videoUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { uploadVideo, getApprovedVideos, getMyVideos, getAllVideos, approveVideo, deleteVideo };
