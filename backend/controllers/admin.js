import { User, WorkerProfile, Booking, Review, Notification, ServiceCategory } from '../models/index.js';
import { successResponse, errorResponse, getPaginationParams } from '../utils/helpers.js';

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (admin)
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed', paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, {
      stats: {
        totalUsers,
        totalWorkers,
        totalCustomers,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      monthlyData: monthlyBookings,
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch dashboard', 500);
  }
};

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10, search } = req.query;
    const { skip } = getPaginationParams({ page, limit });

    const query = {};

    if (role) query.role = role;
    if (status === 'suspended') query.isSuspended = true;
    if (status === 'active') query.isSuspended = false;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return successResponse(res, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch users', 500);
  }
};

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend a user
// @access  Private (admin)
export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isSuspended: true },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 'User not found', 404);
    }

    // Create notification
    await Notification.create({
      userId: id,
      type: 'system',
      title: 'Account Suspended',
      message: `Your account has been suspended. Reason: ${reason || 'No reason provided'}`,
      priority: 'high',
    });

    return successResponse(res, user, 'User suspended successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to suspend user', 500);
  }
};

// @route   PUT /api/admin/users/:id/unsuspend
// @desc    Unsuspend a user
// @access  Private (admin)
export const unsuspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isSuspended: false },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 'User not found', 404);
    }

    await Notification.create({
      userId: id,
      type: 'system',
      title: 'Account Restored',
      message: 'Your account suspension has been lifted',
    });

    return successResponse(res, user, 'User unsuspended successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to unsuspend user', 500);
  }
};

// @route   GET /api/admin/workers/pending
// @desc    Get pending worker approvals
// @access  Private (admin)
export const getPendingWorkers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip } = getPaginationParams({ page, limit });

    const workers = await WorkerProfile.find({ isApproved: false })
      .populate('userId', 'name email phone profileImage')
      .populate('category', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: 1 });

    const total = await WorkerProfile.countDocuments({ isApproved: false });

    return successResponse(res, {
      workers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch pending workers', 500);
  }
};

// @route   PUT /api/admin/workers/:id/approve
// @desc    Approve worker profile
// @access  Private (admin)
export const approveWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await WorkerProfile.findByIdAndUpdate(
      id,
      { isApproved: true, approvedAt: new Date() },
      { new: true }
    ).populate('userId');

    if (!worker) {
      return errorResponse(res, 'Worker not found', 'Worker not found', 404);
    }

    // Create notification
    await Notification.create({
      userId: worker.userId._id,
      type: 'document_verified',
      title: 'Profile Approved',
      message: 'Your worker profile has been approved. You can now accept bookings!',
      priority: 'high',
      sendEmail: true,
    });

    return successResponse(res, worker, 'Worker approved successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to approve worker', 500);
  }
};

// @route   PUT /api/admin/workers/:id/reject
// @desc    Reject worker profile
// @access  Private (admin)
export const rejectWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const worker = await WorkerProfile.findByIdAndUpdate(
      id,
      { rejectionReason: reason, isApproved: false },
      { new: true }
    ).populate('userId');

    if (!worker) {
      return errorResponse(res, 'Worker not found', 'Worker not found', 404);
    }

    await Notification.create({
      userId: worker.userId._id,
      type: 'system',
      title: 'Profile Rejected',
      message: `Your worker profile was rejected. Reason: ${reason || 'Please contact support'}`,
      priority: 'high',
      sendEmail: true,
    });

    return successResponse(res, worker, 'Worker rejected');
  } catch (error) {
    errorResponse(res, error, 'Failed to reject worker', 500);
  }
};

// @route   GET /api/admin/bookings/:id
// @desc    Get booking details (admin view)
// @access  Private (admin)
export const getBookingForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('customerId')
      .populate('workerId')
      .populate('categoryId')
      .populate('workerProfileId');

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    return successResponse(res, booking);
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch booking', 500);
  }
};

// @route   GET /api/admin/complaints
// @desc    Get all complaints/disputes
// @access  Private (admin)
export const getComplaints = async (req, res) => {
  try {
    return successResponse(res, { message: 'Complaints feature coming soon' });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch complaints', 500);
  }
};

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (admin)
export const getAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    const categoryStats = await WorkerProfile.aggregate([
      {
        $group: {
          _id: '$category',
          workerCount: { $sum: 1 },
          avgRating: { $avg: '$ratings.average' },
        },
      },
      { $lookup: { from: 'servicecategories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $sort: { workerCount: -1 } },
    ]);

    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    return successResponse(res, {
      categoryStats,
      bookingStats,
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch analytics', 500);
  }
};
