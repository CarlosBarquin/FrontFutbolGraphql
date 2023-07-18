import { MongoClient } from "mongo";


import { MatchSchema, PlayerSchema, TeamSchema } from "./schema.ts";


const client = new MongoClient();
await client.connect(`mongodb://mongo:27017`);

const db = client.database("MyDatabase");

export const MatchCollection = db.collection<MatchSchema>("matches");
export const TeamCollection = db.collection<TeamSchema>("teams");
export const PlayerCollection = db.collection<PlayerSchema>("players");
