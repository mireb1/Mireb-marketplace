const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route pour uploader une image (accessible uniquement aux administrateurs)
router.post('/', protect, admin, uploadImage);

module.exports = router;
