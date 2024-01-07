import { MongoClient } from "mongodb";

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI_LOC!; // Replace with your MongoDB connection string

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const connectDatabase = async () => {
    try {
        if (!clientPromise) {
            client = new MongoClient(MONGO_URI);
            clientPromise = client.connect();
        }

        return clientPromise;
    } catch (error) {
        console.error("En error occured while connecting to MongoDB", error);
        throw error;
    }
};

export default connectDatabase;
