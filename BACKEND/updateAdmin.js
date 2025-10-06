import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

dotenv.config();

async function updateUserToAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    const email = 'admin@example.com';
    const password = 'admin123';
    let user = await User.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
      console.log('Admin created:', user._id);
    } else if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Existing user promoted to admin');
    } else {
      console.log('Admin already exists');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateUserToAdmin();