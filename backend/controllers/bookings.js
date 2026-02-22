import { Booking, User, WorkerProfile, Notification } from '../models/index.js';
import { successResponse, errorResponse, getPaginationParams } from '../utils/helpers.js';

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (customer)
export const createBooking = async (req, res) => {
  try {
    const {
      workerId,
      categoryId,
      serviceDescription,
      bookingDate,
      estimatedCompletionDate,
      amount,
      location,
      paymentMethod,
    } = req.body;

    // Verify worker exists
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return errorResponse(res, 'Invalid worker', 'Worker not found', 404);
    }

    // Verify worker profile exists
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (!workerProfile) {
      return errorResponse(res, 'Worker profile not found', 'Worker profile not found', 404);
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      workerId,
      categoryId,
      workerProfileId: workerProfile._id,
      serviceDescription,
      bookingDate: new Date(bookingDate),
      estimatedCompletionDate: new Date(estimatedCompletionDate),
      amount,
      location,
      paymentMethod,
    });

    // Create notification for worker
    await Notification.create({
      userId: workerId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${req.user.name} has requested your services`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      priority: 'high',
    });

    const populatedBooking = await booking.populate([
      { path: 'customerId', select: 'name profileImage' },
      { path: 'workerId', select: 'name profileImage' },
      { path: 'categoryId', select: 'name' },
    ]);

    return successResponse(res, populatedBooking, 'Booking created successfully', 201);
  } catch (error) {
    errorResponse(res, error, 'Failed to create booking', 500);
  }
};

// @route   GET /api/bookings
// @desc    Get user bookings (customer: his bookings, worker: bookings assigned to him)
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const { skip } = getPaginationParams({ page, limit });

    let query = {};

    if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'worker') {
      query.workerId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name profileImage phone')
      .populate('workerId', 'name profileImage phone')
      .populate('categoryId', 'name icon')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    return successResponse(res, {
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch bookings', 500);
  }
};

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('customerId', 'name profileImage phone email')
      .populate('workerId', 'name profileImage phone')
      .populate('categoryId', 'name icon')
      .populate('workerProfileId', 'bio skills ratings');

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    // Check authorization
    if (
      booking.customerId._id.toString() !== req.user._id.toString() &&
      booking.workerId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return errorResponse(res, 'Unauthorized', 'You cannot view this booking', 403);
    }

    return successResponse(res, booking);
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch booking', 500);
  }
};

// @route   PUT /api/bookings/:id/accept
// @desc    Accept booking (worker)
// @access  Private (worker)
export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    if (booking.workerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized', 'Only assigned worker can accept', 403);
    }

    if (booking.status !== 'pending') {
      return errorResponse(res, 'Invalid status', 'Booking is not pending', 400);
    }

    booking.status = 'accepted';
    booking.acceptedAt = new Date();
    await booking.save();

    // Create notification for customer
    await Notification.create({
      userId: booking.customerId,
      type: 'booking_accepted',
      title: 'Booking Accepted',
      message: `${req.user.name} has accepted your booking request`,
      relatedId: booking._id,
      relatedModel: 'Booking',
      priority: 'high',
    });

    return successResponse(res, booking, 'Booking accepted successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to accept booking', 500);
  }
};

// @route   PUT /api/bookings/:id/reject
// @desc    Reject booking (worker)
// @access  Private (worker)
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    if (booking.workerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized', 'Only assigned worker can reject', 403);
    }

    if (booking.status !== 'pending') {
      return errorResponse(res, 'Invalid status', 'Booking is not pending', 400);
    }

    booking.status = 'rejected';
    booking.rejectedAt = new Date();
    booking.cancellationReason = reason;
    await booking.save();

    // Create notification for customer
    await Notification.create({
      userId: booking.customerId,
      type: 'booking_rejected',
      title: 'Booking Rejected',
      message: `${req.user.name} has rejected your booking request`,
      relatedId: booking._id,
      relatedModel: 'Booking',
    });

    return successResponse(res, booking, 'Booking rejected');
  } catch (error) {
    errorResponse(res, error, 'Failed to reject booking', 500);
  }
};

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking (customer/worker)
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    // Check authorization
    if (
      booking.customerId.toString() !== req.user._id.toString() &&
      booking.workerId.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 'Unauthorized', 'Cannot cancel this booking', 403);
    }

    if (['completed', 'reviewed', 'cancelled', 'rejected'].includes(booking.status)) {
      return errorResponse(res, 'Invalid status', 'Cannot cancel this booking', 400);
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = req.user.role === 'customer' ? 'customer' : 'worker';
    booking.cancellationReason = reason;
    await booking.save();

    // Notify other party
    const otherUserId =
      booking.customerId.toString() === req.user._id.toString()
        ? booking.workerId
        : booking.customerId;

    await Notification.create({
      userId: otherUserId,
      type: 'booking_rejected',
      title: 'Booking Cancelled',
      message: 'A booking has been cancelled',
      relatedId: booking._id,
      relatedModel: 'Booking',
    });

    return successResponse(res, booking, 'Booking cancelled successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to cancel booking', 500);
  }
};

// @route   PUT /api/bookings/:id/complete
// @desc    Mark booking as completed
// @access  Private (worker)
export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { photos = [] } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    if (booking.workerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized', 'Only worker can complete booking', 403);
    }

    if (booking.status !== 'in_progress') {
      return errorResponse(res, 'Invalid status', 'Booking is not in progress', 400);
    }

    booking.status = 'completed';
    booking.actualCompletionDate = new Date();
    if (photos.length > 0) {
      booking.images = photos;
    }
    await booking.save();

    // Update worker profile stats
    const workerProfile = await WorkerProfile.findByIdAndUpdate(
      booking.workerProfileId,
      {
        $inc: { completedBookings: 1, earnings: booking.amount },
      }
    );

    // Create notification for customer
    await Notification.create({
      userId: booking.customerId,
      type: 'booking_completed',
      title: 'Service Completed',
      message: 'Your booking has been marked as completed',
      relatedId: booking._id,
      relatedModel: 'Booking',
      priority: 'high',
    });

    return successResponse(res, booking, 'Booking completed');
  } catch (error) {
    errorResponse(res, error, 'Failed to complete booking', 500);
  }
};

// @route   PUT /api/bookings/:id/start
// @desc    Start booking (worker starts work)
// @access  Private (worker)
export const startBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    if (booking.workerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized', 'Only worker can start booking', 403);
    }

    if (booking.status !== 'accepted') {
      return errorResponse(res, 'Invalid status', 'Booking must be accepted first', 400);
    }

    booking.status = 'in_progress';
    await booking.save();

    return successResponse(res, booking, 'Booking started');
  } catch (error) {
    errorResponse(res, error, 'Failed to start booking', 500);
  }
};
