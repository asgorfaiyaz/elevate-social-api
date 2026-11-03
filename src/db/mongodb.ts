import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { MongoClient } from "mongodb";
import { env } from "../config/env.js";

const mongoClient = new MongoClient(env.MONGODB_URI);
export const db = mongoClient.db("elevate-social");

export default async function main() {
  await mongoClient.connect();
  console.log("DB is connected");
}
