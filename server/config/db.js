import mongoose from 'mongoose';
import { autoSeedDatabase } from './autoSeed.js';

let mongoMemoryInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    // 1. Try connecting to specified URI (e.g. MongoDB Atlas or running mongod)
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await autoSeedDatabase();
  } catch (error) {
    console.warn(`⚠️ Could not connect to primary MongoDB URI (${error.message}).`);
    console.log('🔄 Initializing in-memory embedded MongoDB engine...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryInstance = await MongoMemoryServer.create();
      const memUri = mongoMemoryInstance.getUri();

      const conn = await mongoose.connect(memUri);
      console.log(`✅ Embedded In-Memory MongoDB Connected at ${memUri}`);
      await autoSeedDatabase();
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB failed to start: ${memError.message}`);
      console.log('ℹ️ Tip: To use MongoDB Atlas, add your connection string to server/.env');
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (mongoMemoryInstance) {
    await mongoMemoryInstance.stop();
  }
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
