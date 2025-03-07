const { encryptionSchema } = require("./encryptionSchema");
const { MongoClient, ClientEncryption } = require("mongodb");

const database = "Medcare";
const collection = "medicalRecords";
const nameSpace = `${database}.${collection}`; 
const connectionString = process.env.MONGO_URI;

// Use the Windows DLL with absolute path
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
const regularClient = new MongoClient(connectionString,{
  autoEncryption: {
    bypassAutoEncryption:true,
    keyVaultNamespace, 
    kmsProviders,
  },
});
const coll= regularClient.db(database).collection(collection);
const encryption = new ClientEncryption(regularClient, {    
  bypassAutoEncryption:true,
    keyVaultNamespace, 
    kmsProviders,
});

// Connection state tracking
let regularClientConnected = false;
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
  encryption,
  regularClient, 
  connectRegularClient,
  closeConnections ,
  coll
};
