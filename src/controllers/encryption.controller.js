const { StatusCodes } = require('http-status-codes');
const encryptionService = require('../services/encryption.service');

class encryptionController {
  async createEncryption(req, res) {
    const user = await encryptionService.createEncryption(req.body);
    res.status(StatusCodes.CREATED).json({ user });
  }
  async fetchPatientMedicalRecord(req,res){
    const data = await encryptionService.fetchUserMedicalRecords(req.params.id)
    res.status(StatusCodes.OK).json({data})
  }
}

module.exports = new encryptionController(); 