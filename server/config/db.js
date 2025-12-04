import mongoose from "mongoose";

const connectDB = async () => {
  try {
   
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
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
    console.error('Tips: verify DB username/password, include the database name in the URI (e.g. ' +
      'mongodb+srv://user:pass@host/<dbname>?retryWrites=true&w=majority), and ensure your Atlas IP' +
      ' whitelist allows your current IP (or 0.0.0.0/0 for testing).');

    process.exit(1);
  }
};

export default connectDB;
