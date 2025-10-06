const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  createAdminDataset, 
  getAllAdminDatasets, 
  getAdminDatasetById, 
  updateAdminDataset, 
  deleteAdminDataset 
} = require('../controllers/adminDatasetController');

// Routes with admin protection
router.route('/')
  .post(protect, admin, createAdminDataset)
  .get(protect, admin, getAllAdminDatasets);

router.route('/:id')
  .get(protect, admin, getAdminDatasetById)
  .put(protect, admin, updateAdminDataset)
  .delete(protect, admin, deleteAdminDataset);

module.exports = router;