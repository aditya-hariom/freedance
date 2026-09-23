const mongoose = require('mongoose');

let mongodInstance = null;

/**
 * Connect to MongoDB.
 * Attempts connection to MONGO_URI if available, or seamlessly spins up
 * an in-memory MongoDB instance for zero-dependency local evaluation and testing.
 */
async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  const forceMemory = process.env.USE_MEMORY_DB === 'true';

  if (!forceMemory && mongoUri) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Could not connect to external MongoDB: ${err.message}`);
      console.log('[Database] Falling back to embedded MongoMemoryServer for standalone run...');
    }
  }

  // Fallback or explicit in-memory MongoDB
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    if (!mongodInstance) {
      mongodInstance = await MongoMemoryServer.create();
    }
    const memoryUri = mongodInstance.getUri();
    console.log(`[Database] Starting In-Memory MongoDB at: ${memoryUri}`);
    const conn = await mongoose.connect(memoryUri);
    console.log('[Database] Embedded In-Memory MongoDB Connected successfully.');
    return conn;
  } catch (err) {
    console.error('[Database] Failed to start MongoDB:', err.message);
    throw err;
  }
}

/**
 * Disconnect from MongoDB and stop memory instance if active
 */
async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
      mongodInstance = null;
    }
    console.log('[Database] MongoDB disconnected cleanly.');
  } catch (err) {
    console.error('[Database] Error during disconnect:', err.message);
  }
}

module.exports = {
  connectDB,
  disconnectDB
};
