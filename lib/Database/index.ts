import mongoose from 'mongoose';

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI_LOC!; // Replace with your MongoDB connection string

const connectDatabase = async () => {
  try {
    const client = await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDatabase;
