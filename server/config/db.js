import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      retries++;
      
      // Print detailed error info to help debugging (no passwords shown)
      const maskedUri = (u) => {
        if (!u) return 'MONGO_URI not set';
        try {
          return u.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:*****@');
        } catch (e) {
          return 'MONGO_URI present (could not mask)';
        }
      };

      console.error('MongoDB connection error:');
      console.error(error && error.message ? error.message : error);
      if (error && error.name) console.error('Error name:', error.name);
      if (error && error.code) console.error('Error code:', error.code);
      console.error('MONGO_URI (masked):', maskedUri(process.env.MONGO_URI));
      console.error(`Attempt ${retries}/${maxRetries} failed. Retrying in 3 seconds...`);
      console.error('Tips: verify DB username/password, include the database name in the URI (e.g. ' +
        'mongodb+srv://user:pass@host/<dbname>?retryWrites=true&w=majority), and ensure your Atlas IP' +
        ' whitelist allows your current IP (or 0.0.0.0/0 for testing).');

      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return attemptConnection();
      } else {
        console.error(`Failed to connect to MongoDB after ${maxRetries} attempts.`);
        process.exit(1);
      }
    }
  };

  return attemptConnection();
};

export default connectDB;
