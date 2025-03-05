const { Binary } = require("mongodb");

const encryptionSchema = (dataKey) => {
    return {
        bsonType: "object",
        encryptMetadata: {
            keyId: [new Binary(Buffer.from(dataKey, "base64"), 4)],
        },
        properties: {
            report: {
                bsonType: "object",
                properties: {
                    PatientName: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
                        },
                    },
                    consultationTime: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    chiefComplaint: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    dateOfBirth: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
                        },
                    },
                    clinicalInvestigations: {
                        bsonType: "object",
                        properties: {
                            labTests: {
                                encrypt: {
                                    bsonType: "array",
                                    algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                                },
                            },
                            imaging: {
                                encrypt: {
                                    bsonType: "array",
                                    algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                                },
                            },
                        },
                    },
                    consultationDate: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    historyOfPresentIllness: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    assessment: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    diagnosis: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    treatmentPlan: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    prescriptions: {
                        encrypt: {
                            bsonType: "array",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                    recommendation: {
                        encrypt: {
                            bsonType: "string",
                            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
                        },
                    },
                },
            },
        },
    };
};

module.exports = { encryptionSchema };
