const path = require("path");
const { encryptionSchema } = require("./encryptionSchema");
const { MongoClient } = require("mongodb");

const database = "Medcare";
const collection = "medicalRecords";
const nameSpace = `${database}.${collection}`;
const connectionString = process.env.MONGO_URI;
const extraOptions = {
  cryptSharedLibPath: path.resolve(
    process.cwd(),
    "src",
    "utils",
    "mongo_crypt_v1.dll"
  ),
};
const kmsProviders = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
};
const keyVaultNamespace = `encryption.__keyVault`;
const dataKey = process.env.DEK_KEY;
const RecordsSchema = encryptionSchema(dataKey);
const medicalRecordSchema= {};
medicalRecordSchema[nameSpace] = RecordsSchema;
const secureClient = new MongoClient(connectionString, {
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,
    schemaMap: medicalRecordSchema,
    extraOptions,
  },
});
const regularClient = new MongoClient(connectionString);

module.exports = { secureClient, regularClient };
