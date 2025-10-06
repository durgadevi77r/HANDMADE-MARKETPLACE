import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes - verify token
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  console.log('Admin middleware check for user:', req.user?.email, 'role:', req.user?.role, 'isAdmin:', req.user?.isAdmin);
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    next();
  } else {
    console.log('Admin access denied for user:', req.user?.email);
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};