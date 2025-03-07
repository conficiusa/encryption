const { isValidObjectId,Types } = require('mongoose');
const { secureClient, connectSecureClient } = require('../utils/encryptionClient');
const { formSchema } = require('../utils/schema');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { ObjectId } = require('mongodb');

class encryptionService {
  async createEncryption(data) {
    const parsedData = formSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error(parsedData.error.message);
    }
    const { patientId, doctorId, appointmentId, ...report } = data;
    // Process lab_tests and imaging to extract only the value property
    const processedReport = { ...report };
    
    // Transform lab_tests if it exists
    if (processedReport.clinicalInvestigations?.lab_tests?.length) {
      processedReport.clinicalInvestigations.lab_tests = 
      processedReport.clinicalInvestigations.lab_tests.map(item => item.value);
    }
    
    // Transform imaging if it exists
    if (processedReport.clinicalInvestigations?.imaging?.length) {
      processedReport.clinicalInvestigations.imaging = 
      processedReport.clinicalInvestigations.imaging.map(item => item.value);
    }

    const record = {
      patientId,
      doctorId,
      appointmentId,
      report: processedReport,
    };
    
    //convert ids to ObjectIds
    record.patientId = new ObjectId(record.patientId);
    record.doctorId = new ObjectId(record.doctorId);
    record.appointmentId = new ObjectId(record.appointmentId);

    // Make sure we're connected
    await connectSecureClient();
    const writeResult = await secureClient
      .db("Medcare")
      .collection("medicalRecords")
      .insertOne(record);
    
    return writeResult;
  }

  async fetchUserMedicalRecords(patientId) {
    if(!patientId){
      throw new Error('Patient ID is required');
    }
    if (!isValidObjectId(patientId)){
      throw new Error('Invalid patient ID'); 
    }

    // Make sure we're connected
    await connectSecureClient();
    
    // Get the cursor but don't try to return it directly
    const cursor = await secureClient
      .db("Medcare")
      .collection("medicalRecords")
      .find({ patientId });
    
    // Convert cursor to array of documents
    const reports = await cursor.toArray();
    
    // Check if any records were found
    if (reports.length === 0) {
      throw new NotFoundError('No medical records found for this patient');
    }
    
    return reports;
  }
}

module.exports = new encryptionService();