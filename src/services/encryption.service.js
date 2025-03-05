const { secureClient } = require('../utils/encryptionClient');
const { formSchema } = require('../utils/schema');

class encryptionService {
  async createEncryption(data) {
   const parsedData= formSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error(parsedData.error.message);
    }
    const { patientId, doctorId, appointmentId, ...report } = data;
    const record = {
      patientId,
      doctorId,
      appointmentId,
      report,
    };
    await secureClient.connect();
    const writeResult = await secureClient
      .db("Medcare")
      .collection("medicalRecords")
      .insertOne(record);
    await secureClient.close();
    return writeResult;
  }
}

module.exports = new encryptionService();