const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const auth = require("../middleware/auth");
const fs = require('fs');
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 5MB limit
  }
});

// Upload profile picture (accept Cloudinary URL)
router.post("/profile-picture", auth, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    
    if (!profilePicture) {
      return res.status(400).json({ message: "Please provide a profile picture URL" });
    }

    // Update user in database with Cloudinary URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: profilePicture },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: user
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
