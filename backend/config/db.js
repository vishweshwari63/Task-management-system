const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/focushub');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error('Please make sure your MongoDB instance is running locally on port 27017, or set a MONGO_URI inside backend/.env to connect to your MongoDB Atlas cluster.');
  }
};

module.exports = connectDB;
