const mongodb = require("mongodb");
const { MongoClient, Binary, ClientEncryption } = mongodb;

// start-kmsproviders
const provider = "aws";
const kmsProviderCredentials = {
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET,
	},
};
// end-kmsproviders

// start-datakeyopts
const masterKey = {
	key: process.env.AWS_KEY_ARN,
	region: process.env.AWS_REGION,
};
// end-datakeyopts

async function main() {
	// start-create-index
	const uri =process.env.MONGO_URI;
	const keyVaultDatabase = "encryption";
	const keyVaultCollection = "__keyVault";
	const keyVaultNamespace = `${keyVaultDatabase}.${keyVaultCollection}`;
	const keyVaultClient = new MongoClient(uri);
	await keyVaultClient.connect();
	const keyVaultDB = keyVaultClient.db(keyVaultDatabase);
	const keyVaultColl = keyVaultDB.collection(keyVaultCollection);
	await keyVaultColl.createIndex(
		{ keyAltNames: 1 },
		{
			unique: true,
			partialFilterExpression: { keyAltNames: { $exists: true } },
		}
	);
	// end-create-index

	// start-create-dek
	const client = new MongoClient(uri);
	await client.connect();

	const encryption = new ClientEncryption(client, {
		keyVaultNamespace,
		kmsProviders: kmsProviderCredentials,
	});
	const key = await encryption.createDataKey(provider, {
		masterKey: masterKey,
		keyAltNames: ["medcareEncryptionKey"] // Adding keyAltName to identify the key
	});
	console.log("DataKeyId [base64]: ", key.toString("base64"));
	await keyVaultClient.close();
	await client.close();
	// end-create-dek
}
main();
