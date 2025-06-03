import { MongoClient, ServerApiVersion } from "mongodb";
import { username, db_password, cluster_string } from "credentials.js";

function connectClient() {
  const uri = `mongodb+srv://${username}:${db_password}@${cluster_string}.mongodb.net/?retryWrites=true&w=majority&appName=Products`;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    compressors: ["snappy"], // Network Compression Module
  });

  return client;
}

function pingDB() {
  const client = connectClient();

  async function run() {
    try {
      await client.connect(); // (optional starting in v4.7)

      await client.db("admin").command({ ping: 1 });
      console.log("You successfully connected to MongoDB!");
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
  return client;
}

function findDB(query) {
  const client = connectClient();

  async function run() {
    try {
      const db = client.db("sample_mflix");
      const collection = db.collection("users");

      const response = await collection.findOne(query); // Queries here
      console.log(response);
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
}

// pingDB();
// findDB({});
export { pingDB, findDB };
