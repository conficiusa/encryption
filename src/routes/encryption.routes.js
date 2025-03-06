const express = require('express');
const router = express.Router();
const encryptionController = require('../controllers/encryption.controller');

router.post('/', encryptionController.createEncryption);
// router.get('/', encryptionController.getAllUsers);
router.get('/:id', encryptionController.fetchPatientMedicalRecord);
// router.patch('/:id', encryptionController.updateUser);
// router.delete('/:id', encryptionController.deleteUser);

module.exports = router;