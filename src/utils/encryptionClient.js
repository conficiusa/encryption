const path = require("path");
const { encryptionSchema } = require("./encryptionSchema");
const { MongoClient } = require("mongodb");
const os = require("os");

const database = "Medcare";
const collection = "medicalRecords";
const nameSpace = `${database}.${collection}`; 
const connectionString = process.env.MONGO_URI;

// Determine the appropriate crypto library path based on platform
const getCryptoLibraryPath = () => {
  // Check if we're running in Docker (via environment variable)
  if (process.env.PLATFORM === 'docker') {
    console.log('Using MongoDB encryption in Docker environment');
    // In Docker, use the absolute path to the copied shared library
    return "/usr/lib/mongodb-crypt/libmongocrypt.so";
  } else {
    // On Windows, use the bundled DLL with absolute path
    console.log('Using local Windows DLL for MongoDB encryption');
    return path.resolve(__dirname, "mongo_crypt_v1.dll");
  }
};

// Configure encryption options
const extraOptions = {};
const cryptSharedLibPath = getCryptoLibraryPath();
if (cryptSharedLibPath) {
  console.log(`Using crypto library at: ${cryptSharedLibPath}`);
  extraOptions.cryptSharedLibPath = cryptSharedLibPath;
}

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
