/**
 * config/db.js
 * ------------
 * Database connection configuration.
 *
 * What this file does RIGHT NOW:
 *   - Exports a placeholder connectDB() function that logs a message
 *
 * What you will add LATER:
 *   - Import mongoose
 *   - Read MONGO_URI from process.env
 *   - Call mongoose.connect() with proper options
 *   - Handle connection errors and retry logic
 *
 * Example of what the real implementation will look like:
 *
 *   const mongoose = require('mongoose');
 *   const connectDB = async () => {
 *     const conn = await mongoose.connect(process.env.MONGO_URI);
 *     console.log(`MongoDB connected: ${conn.connection.host}`);
 *   };
 */



const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


// const connectDB = async () => {
//   // TODO: Replace this placeholder with a real MongoDB connection
//   console.log(
//     "[db.js] connectDB() called — no real DB connected yet (placeholder)"
//   );
// };

// module.exports = { connectDB };
