/**
 * Database Connection Configuration
 * Handles MongoDB connection with retry logic and event handlers
 */

const mongoose = require('mongoose');
const { ENV, DB_CONFIG, ERROR_MESSAGES } = require('./constants');

/**
 * Connect to MongoDB with retry logic
 * @param {number} retries - Number of retry attempts remaining
 * @returns {Promise<void>}
 */
const connectDB = async (retries = DB_CONFIG.MAX_RETRIES) => {
  try {
    // Validate MongoDB URI
    if (!ENV.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Connection options for production optimization
    const options = {
      maxPoolSize: DB_CONFIG.OPTIONS.maxPoolSize,
      serverSelectionTimeoutMS: DB_CONFIG.OPTIONS.serverSelectionTimeoutMS,
      socketTimeoutMS: DB_CONFIG.OPTIONS.socketTimeoutMS,
      // Disable auto index creation in production for performance
      autoIndex: ENV.NODE_ENV === 'development'
    };

    // Connect to MongoDB
    await mongoose.connect(ENV.MONGO_URI, options);

    console.log(`✅ MongoDB connected successfully`);
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);

  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);

    // Retry logic
    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, DB_CONFIG.RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    // Exit if all retries failed
    console.error('💥 Failed to connect to MongoDB after all retries');
    process.exit(1);
  }
};

/**
 * MongoDB connection event handlers
 */
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`🚨 Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

/**
 * Graceful shutdown handler
 * Closes MongoDB connection when app terminates
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received. Closing MongoDB connection...`);
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error closing MongoDB connection:', err.message);
    process.exit(1);
  }
};

// Handle process termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = connectDB;
