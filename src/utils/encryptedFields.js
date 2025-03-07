const { encryption } = require("./encryptionClient");

// Using keyAltName only for more reliable key identification
console.log("Using encryption with key alt name");
const RandomEncryption = {
	algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
	keyAltName: "medcareEncryptionKey"
};

const encryptionFields = async (data) => {
	return {
		patientId: data.patientId,
		doctorId: data.doctorId,
		appointmentId: data.appointmentId,
		report: {
			patientName: await encryption.encrypt(
				data.report.patientName,
				RandomEncryption
			),
			dateOfBirth: await encryption.encrypt(
				data.report.dateOfBirth,
				RandomEncryption
			),
			consultationDate: await encryption.encrypt(
				data.report.consultationDate,
				RandomEncryption
			),
			consultationTime: await encryption.encrypt(
				data.report.consultationTime,
				RandomEncryption
			),
			chiefComplaint: await encryption.encrypt(
				data.report.chiefComplaint,
				RandomEncryption
			),
			historyOfPresentIllness: await encryption.encrypt(
				data.report.historyOfPresentIllness,
				RandomEncryption
			),
			clinicalInvestigations: {
				lab_tests: await encryption.encrypt(
					data.report.clinicalInvestigations.lab_tests,
					RandomEncryption
				),
				imaging: await encryption.encrypt(
					data.report.clinicalInvestigations.imaging,
					RandomEncryption
				),
			},
			assessment: await encryption.encrypt(
				data.report.assessment,
				RandomEncryption
			),
			diagnosis: await encryption.encrypt(
				data.report.diagnosis,
				RandomEncryption
			),
			treatmentPlan: await encryption.encrypt(
				data.report.treatmentPlan,
				RandomEncryption
			),
			prescriptions: await Promise.all(
				data.report.prescriptions.map(async (prescription) => {
					return {
						medication: await encryption.encrypt(
							prescription.medication,
							RandomEncryption
						),
						dosage: await encryption.encrypt(
							prescription.dosage,
							RandomEncryption
						),
						frequency: await encryption.encrypt(
							prescription.frequency,
							RandomEncryption
						),
						duration: await encryption.encrypt(
							prescription.duration,
							RandomEncryption
						),
						instructions: await encryption.encrypt(
							prescription.instructions,
							RandomEncryption
						),
					};
				})
			),
			recommendation: await encryption.encrypt(
				data.report.recommendation,
				RandomEncryption
			),
		},
	};
};

module.exports = { encryptionFields };
