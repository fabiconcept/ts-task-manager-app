import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI_LOC;

let client;
let clientPromise;

const connectDatabaseFromServer = async () => {
    console.log(MONGO_URI)
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI not found");
        }
        if (!clientPromise) {
            client = new MongoClient(MONGO_URI);
            clientPromise = client.connect();
        }

        return clientPromise;
    } catch (error) {
        console.error("En error occured while connecting to MongoDB", error);
    }
};

export default connectDatabaseFromServer;