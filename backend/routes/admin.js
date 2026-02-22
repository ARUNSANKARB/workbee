import express from 'express';
import {
  getDashboard,
  getAllUsers,
  suspendUser,
  unsuspendUser,
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  getBookingForAdmin,
  getComplaints,
  getAnalytics,
} from '../controllers/admin.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected and admin-only
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/unsuspend', unsuspendUser);
router.get('/workers/pending', getPendingWorkers);
router.put('/workers/:id/approve', approveWorker);
router.put('/workers/:id/reject', rejectWorker);
router.get('/bookings/:id', getBookingForAdmin);
router.get('/complaints', getComplaints);
router.get('/analytics', getAnalytics);

export default router;
