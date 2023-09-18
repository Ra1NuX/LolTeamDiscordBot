import { MongoClient } from "mongodb";
import env from "../env";

export default new MongoClient(env.DB_URI);

