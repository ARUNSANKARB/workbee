import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Database connection failed: ${error.message}`);
    if (process.env.NODE_ENV === "development") {
      console.log("Server will run without the database(development)");
      return null;
    }
    else {
      console.error("Production environment - Shutting down the server");
      process.exit(1);
    }
  }
};

export default connectDB;
