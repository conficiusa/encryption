const { StatusCodes } = require('http-status-codes');
const encryptionService = require('../services/encryption.service');

class encryptionController {
  async createEncryption(req, res) {
    const user = await encryptionService.createEncryption(req.body);
    res.status(StatusCodes.CREATED).json({ user });
  }
}

module.exports = new encryptionController();