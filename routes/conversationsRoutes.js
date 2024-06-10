const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversationsController');

router.get('/:id', conversationsController.getConversationById);
router.post('/', conversationsController.createConversation)

module.exports = router;