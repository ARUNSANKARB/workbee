import express from 'express';
import {
  createUpdateWorkerProfile,
  getWorkerProfile,
  getWorkersByCategory,
  searchWorkers,
  uploadDocument,
  updateAvailability,
  getWorkerReviews,
  getEarningsDashboard,
} from '../controllers/workers.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateWorkerProfile, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/category/:categoryId', getWorkersByCategory);
router.get('/search', searchWorkers);
router.get('/:id', getWorkerProfile);
router.get('/:id/reviews', getWorkerReviews);

// Protected routes (worker only)
router.post('/profile', protect, authorize('worker'), validateWorkerProfile, handleValidationErrors, createUpdateWorkerProfile);
router.post('/upload-document', protect, authorize('worker'), uploadDocument);
router.put('/availability', protect, authorize('worker'), updateAvailability);
router.get('/earnings/:id', protect, authorize('worker'), getEarningsDashboard);

export default router;
