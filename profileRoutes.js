// profileRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const profileController = require('./profileController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars'); // Set the destination folder for avatar uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Use passport.authenticate middleware to protect routes
router.put('/update-profile', upload.single('avatar'), async (req, res) => {
  try {
    console.log('Request Headers:', req.headers);

    const token = req.headers.authorization.replace('Bearer ', ''); // Extract token from headers

    if (!token) {
      return res.status(401).json({ success: false, message: 'JWT token not provided' });
    }

    const decodedToken = await profileController.verifyToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const userId = decodedToken.user_id;
    console.log('Routed extracted token', token);
    
    const newAvatarUrl = req.file ? `/avatars/${req.file.filename}` : null; // Save the path to the uploaded avatar

    // Extract other fields from the request body
    const { name, school, email } = req.body;

    // Update the user's profile in the database with the new avatar URL and other fields
    await profileController.updateProfile(req, userId, { avatarUrl: newAvatarUrl, name, school, email });

    res.json({ success: true, message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
