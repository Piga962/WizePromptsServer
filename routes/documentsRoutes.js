const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentsController');

router.post('/get', documentController.getDocumentByCategoryAndUserId);
router.post('/', documentController.createDocument);

module.exports = router;