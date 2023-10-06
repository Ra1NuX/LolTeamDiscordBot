import { MongoClient } from "mongodb";
import env from "../env";

export const mongoClient = new MongoClient(env.DB_URI)

const db = mongoClient.db(env.DB_NAME);

export default db;

