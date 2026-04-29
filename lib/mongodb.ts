// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI in your .env");
}

let client: MongoClient;
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Only create a new client if not already created
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect().then((client) => {
    console.log("✅ MongoDB connected successfully");
    return client;
  }).catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  });
}

// Use the global promise
const clientPromise: Promise<MongoClient> = global._mongoClientPromise;

export default clientPromise;