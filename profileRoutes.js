// profileRoutes.js
const express = require('express');
const router = express.Router();
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

// PUT endpoint for updating the user's profile with image
router.put('/update-profile', upload.single('avatar'), (req, res) => {
  const userId = req.user.user_id; // Extract user ID from the JWT payload
  const newAvatarUrl = `/avatars/${req.file.filename}`; // Save the path to the uploaded avatar

  // Update the user's profile in the database with the new avatar URL
  // ...

  res.json({ success: true, message: 'Profile updated successfully' });
});


router.post('/update', profileController.updateProfile);

module.exports = router;
