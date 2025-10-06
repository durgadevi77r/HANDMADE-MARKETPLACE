import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
    },
    adminEmail: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    adminPassword: {
      type: String,
      required: [true, 'Admin password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;

