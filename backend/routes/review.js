import express from 'express';
import { getMyReviews,getReviews,createReview } from '../controller/reviewController.js';
import auth from '../middleware/auth.js'

const router = express.Router();
router.post('/',auth,createReview);
router.get('/worker/:id',getReviews)
router.get('/my',auth,getMyReviews);

export default router;