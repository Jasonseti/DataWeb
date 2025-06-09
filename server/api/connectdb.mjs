import { MongoClient, ServerApiVersion } from "mongodb";
import { username, db_password, cluster_string } from "./credentials.js";

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

function gracefulExit() {
  client.close();
  console.log("MongoDB connection closed.");
}

function ping() {
  async function run() {
    try {
      await client.connect(); // (optional starting in v4.7)

      await client.db("admin").command({ ping: 1 });
      console.log("You successfully connected to MongoDB!");
    } finally {
    }
  }
  run().catch(console.dir);
}

function find(query, options, sort = {}, limit = 100) {
  return new Promise((resolve, reject) => {
    let response;
    try {
      const db = client.db("Items");
      const collection = db.collection("items");

      response = collection.find(query, options).sort(sort).limit(limit);
    } finally {
      resolve(response);
    }
  });
}

function insert(document) {
  return new Promise((resolve, reject) => {
    try {
      const db = client.db("Items");
      const collection = db.collection("items");

      collection.insertOne(document);
    } finally {
      resolve();
    }
  });
}

function update(query, options) {
  return new Promise((resolve, reject) => {
    try {
      const db = client.db("Items");
      const collection = db.collection("items");

      collection.updateOne(query, options);
    } finally {
      resolve();
    }
  });
}

function remove(query) {
  return new Promise((resolve, reject) => {
    try {
      const db = client.db("Items");
      const collection = db.collection("items");

      collection.deleteOne(query);
    } finally {
      resolve();
    }
  });
}

const MongoDB = {
  ping: ping,
  find: find,
  insert: insert,
  update: update,
  remove: remove,
  close: gracefulExit,
};
export default MongoDB;
