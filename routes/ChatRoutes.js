const express = require('express');
const router = express.Router();
const multer = require('multer');

const nearbyyController = require('../controllers/nearbyyController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single("file"), nearbyyController.handleFileUpload);
router.get('/context', nearbyyController.getContextResponse);

module.exports = router;
