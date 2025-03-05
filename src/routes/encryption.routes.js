const express = require('express');
const router = express.Router();
const encryptionController = require('../controllers/encryption.controller');

router.post('/', encryptionController.createEncryption);
module.exports = router;