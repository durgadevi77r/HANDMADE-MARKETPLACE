import express from 'express';
import {
  adminSignup,
  adminLogin,
  checkAdminExists,
  getAdminInfo,
  devBootstrapAdmin,
  setAdminDatasetPassword,
  debugAdminAuth,
} from '../controllers/adminAuthController.js';

const router = express.Router();

// Public routes
router.get('/check', checkAdminExists);
// router.post('/signup', adminSignup); // remove signup per new requirement
router.get('/info', getAdminInfo);
router.post('/login', adminLogin);
router.post('/dev-bootstrap', devBootstrapAdmin);
router.post('/set-password', setAdminDatasetPassword);
router.post('/debug-auth', debugAdminAuth);

export default router;

