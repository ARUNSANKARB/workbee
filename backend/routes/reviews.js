import express from 'express';
import {
  createReview,
  getWorkerReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markHelpful,
} from '../controllers/reviews.js';
import { protect } from '../middleware/auth.js';
import { validateReview, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/worker/:workerId', getWorkerReviews);
router.get('/:id', getReviewById);

// Protected routes
router.post('/', protect, validateReview, handleValidationErrors, createReview);
router.put('/:id', protect, validateReview, handleValidationErrors, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', markHelpful);

export default router;
