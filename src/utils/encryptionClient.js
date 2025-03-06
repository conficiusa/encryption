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

// Create clients
const secureClient = new MongoClient(connectionString, {
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,
    schemaMap: medicalRecordSchema,
    extraOptions
  },
});
const regularClient = new MongoClient(connectionString);

// Connection state tracking
let secureClientConnected = false;
let regularClientConnected = false;

// Connection management functions
const connectSecureClient = async () => {
  if (!secureClientConnected) {
    await secureClient.connect();
    secureClientConnected = true;
    console.log("Secure MongoDB client connected");
  }
  return secureClient;
};

const connectRegularClient = async () => {
  if (!regularClientConnected) {
    await regularClient.connect();
    regularClientConnected = true;
    console.log("Regular MongoDB client connected");
  }
  return regularClient;
};

// Graceful shutdown handler
const closeConnections = async () => {
  try {
    if (secureClientConnected) {
      await secureClient.close();
      secureClientConnected = false;
      console.log("Secure MongoDB client disconnected");
    }
    
    if (regularClientConnected) {
      await regularClient.close();
      regularClientConnected = false;
      console.log("Regular MongoDB client disconnected");
    }
  } catch (err) {
    console.error("Error closing MongoDB connections:", err);
  }
};

// Register shutdown handlers
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing MongoDB connections...');
  await closeConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Closing MongoDB connections...');
  await closeConnections();
  process.exit(0);
});

module.exports = { 
  secureClient, 
  regularClient, 
  connectSecureClient, 
  connectRegularClient,
  closeConnections 
};
