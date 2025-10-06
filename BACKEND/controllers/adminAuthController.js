import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import AdminDataset from '../models/adminDatasetModel.js';

// Generate JWT for admin
const generateAdminToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin signup (one-time use)
// @route   POST /api/admin/signup
// @access  Public
export const adminSignup = async (req, res) => {
  try {
    const { adminName, adminEmail, adminPassword } = req.body;

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists. Signup is only allowed once.' });
    }

    // Check if admin email already exists
    const adminExists = await Admin.findOne({ adminEmail });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    const admin = await Admin.create({
      adminName,
      adminEmail,
      adminPassword: hashedPassword,
    });

    if (admin) {
      try {
        // Also store in admindatasets collection for quick admin info access
        await AdminDataset.create({
          adminId: admin._id,
          name: admin.adminName,
          email: admin.adminEmail,
          role: 'admin',
          lastLogin: new Date()
        });
      } catch (_) {
        // non-fatal if dataset insert fails
      }

      res.status(201).json({
        _id: admin._id,
        adminName: admin.adminName,
        adminEmail: admin.adminEmail,
        message: 'Admin created successfully',
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    const emailLower = String(adminEmail || '').trim().toLowerCase();
    const providedPassword = String(adminPassword || '').trim();

    // First try to find admin in Admin collection
    let admin = await Admin.findOne({ $or: [ { adminEmail: emailLower }, { email: emailLower } ] });
    let isAdminCollection = true;
    
    // If not found in Admin collection, try User collection with admin role
    if (!admin) {
      admin = await User.findOne({ email: emailLower, role: 'admin' });
      isAdminCollection = false;
    }
    
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });
    
    const hashed = isAdminCollection ? (admin.adminPassword || admin.password) : admin.password;
    let isMatch = false;
    if (hashed) {
      try { isMatch = await bcrypt.compare(providedPassword, hashed); } catch (_) { isMatch = false; }
    }
    // Dev fallback: allow direct string match if stored unhashed
    if (!isMatch && typeof hashed === 'string' && hashed.length > 0) {
      if (providedPassword === String(hashed).trim()) isMatch = true;
    }
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    try {
      await AdminDataset.findOneAndUpdate(
        { adminId: admin._id },
        { 
          name: isAdminCollection ? admin.adminName : admin.name, 
          email: isAdminCollection ? admin.adminEmail : admin.email, 
          role: 'admin', 
          lastLogin: new Date() 
        },
        { upsert: true, new: true }
      );
    } catch (_) { /* ignore */ }

    res.json({
      _id: admin._id,
      adminName: isAdminCollection ? (admin.adminName || admin.name) : admin.name,
      adminEmail: isAdminCollection ? (admin.adminEmail || admin.email || '').toLowerCase() : admin.email.toLowerCase(),
      role: 'admin',
      isAdmin: true,
      token: generateAdminToken(admin._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check if admin exists
// @route   GET /api/admin/check
// @access  Public
export const checkAdminExists = async (req, res) => {
  try {
    const adminExists = await Admin.findOne({});
    res.json({ exists: !!adminExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Public admin info (email only)
// @route   GET /api/admin/info
// @access  Public
export const getAdminInfo = async (req, res) => {
  try {
    // Prefer admins dataset strictly
    const admin = await Admin.findOne({}).select('adminEmail email').lean();
    if (admin?.adminEmail || admin?.email) return res.json({ email: (admin.adminEmail || admin.email).toLowerCase() });
    // Fallbacks
    const ds = await AdminDataset.findOne({}).select('email').lean();
    if (ds?.email) return res.json({ email: ds.email.toLowerCase() });
    const adminUser = await User.findOne({ role: 'admin' }).select('email').lean();
    if (adminUser?.email) return res.json({ email: adminUser.email.toLowerCase() });
    return res.status(404).json({ message: 'Admin not set up' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Dev helper: upsert admin user in users collection with hashed password
// @route   POST /api/admin/dev-bootstrap
// @access  Public (blocked in production)
export const devBootstrapAdmin = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate(
      { email: String(email).toLowerCase() },
      { name: name || 'Admin', email: String(email).toLowerCase(), password: hash, role: 'admin' },
      { new: true, upsert: true, runValidators: false }
    );
    return res.json({ message: 'Admin user ensured', id: user._id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Set/Reset password for admin in admins dataset (dev utility)
// @route   POST /api/admin/set-password
// @access  Public (blockable via env)
export const setAdminDatasetPassword = async (req, res) => {
  try {
    if (process.env.ADMIN_SETUP_SECRET && req.headers['x-setup-secret'] !== process.env.ADMIN_SETUP_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const emailLower = String(email).toLowerCase();
    const admin = await Admin.findOne({ $or: [ { adminEmail: emailLower }, { email: emailLower } ] });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (admin.adminEmail == null) admin.adminEmail = emailLower;
    admin.adminPassword = hash;
    // Keep legacy fields in sync
    admin.email = emailLower;
    admin.password = hash;
    await admin.save();
    return res.json({ message: 'Admin password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Debug admin auth (returns match diagnostics)
// @route   POST /api/admin/debug-auth
// @access  Public (dev only)
export const debugAdminAuth = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body || {};
    const emailLower = String(adminEmail || '').toLowerCase();
    const admin = await Admin.findOne({ $or: [ { adminEmail: emailLower }, { email: emailLower } ] }).lean();
    if (!admin) {
      return res.json({ found: false, reason: 'admin_not_found', emailQueried: emailLower });
    }
    const hashed = admin.adminPassword || admin.password;
    let bcryptMatch = false;
    let plainMatch = false;
    if (hashed) {
      try { bcryptMatch = await bcrypt.compare(adminPassword || '', hashed); } catch (_) { bcryptMatch = false; }
    }
    if (typeof hashed === 'string') {
      plainMatch = (adminPassword === hashed);
    }
    return res.json({ found: true, emailStored: (admin.adminEmail || admin.email || '').toLowerCase(), hasHashedPassword: !!hashed, bcryptMatch, plainMatch });
  } catch (error) {
    res.status(500).json({ message: 'debug failed' });
  }
};

