const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes privées
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
