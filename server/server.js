

import dotenv from 'dotenv';

dotenv.config();

// Fail early with a clear message when critical env vars are missing.
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  console.error("Create a server/.env file with these variables and restart the server.");
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { setupCloudinary } from './config/cloudinaryConfig.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

// Import all route files
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';


// Wrap startup in async IIFE so we can ensure DB-connected actions (like creating admin)
const start = async () => {
  await connectDB();
  setupCloudinary();

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Use all routes
  app.use('/api/auth', authRoutes);
  app.use('/api/trips', tripRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/users', userRoutes);

  // Ensure an admin user exists / update admin credentials
  try {
    const ADMIN_EMAIL = 'malavath@gmail.com';
    const ADMIN_PASSWORD = '123456';
    const ADMIN_NAME = 'Admin';

    const existingAdmin = await User.findOne({ role: 'admin' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    if (existingAdmin) {
      existingAdmin.email = ADMIN_EMAIL;
      existingAdmin.password = hashedPassword;
      existingAdmin.name = ADMIN_NAME;
      await existingAdmin.save();
      console.log('Admin user updated to', ADMIN_EMAIL);
    } else {
      await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashedPassword, role: 'admin' });
      console.log('Admin user created with email', ADMIN_EMAIL);
    }
  } catch (err) {
    console.error('Failed to ensure admin user:', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();