import { Review, Booking, WorkerProfile, Notification } from '../models/index.js';
import { successResponse, errorResponse, getPaginationParams } from '../utils/helpers.js';

// @route   POST /api/reviews
// @desc    Create a review for completed booking
// @access  Private (customer)
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, pros, cons, wouldRecommend, anonymousReview, images } = req.body;

    // Verify booking exists and is completed
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return errorResponse(res, 'Booking not found', 'Booking not found', 404);
    }

    if (booking.status !== 'completed') {
      return errorResponse(res, 'Invalid status', 'Can only review completed bookings', 400);
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized', 'Only customer can review this booking', 403);
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return errorResponse(res, 'Review exists', 'Review already exists for this booking', 409);
    }

    // Create review
    const review = await Review.create({
      bookingId,
      customerId: req.user._id,
      workerId: booking.workerId,
      workerProfileId: booking.workerProfileId,
      categoryId: booking.categoryId,
      rating,
      comment,
      pros: pros || [],
      cons: cons || [],
      wouldRecommend: wouldRecommend !== false,
      anonymousReview: anonymousReview || false,
      images: images || [],
    });

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, { status: 'reviewed' });

    // Update worker profile ratings
    const allReviews = await Review.find({ workerId: booking.workerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await WorkerProfile.findByIdAndUpdate(booking.workerProfileId, {
      'ratings.average': avgRating,
      'ratings.total': allReviews.reduce((sum, r) => sum + r.rating, 0),
      'ratings.count': allReviews.length,
    });

    // Create notification for worker
    await Notification.create({
      userId: booking.workerId,
      type: 'review_received',
      title: 'New Review',
      message: `You received a ${rating}-star review`,
      relatedId: review._id,
      relatedModel: 'Review',
      priority: 'normal',
      sendEmail: true,
    });

    const populatedReview = await review.populate([
      { path: 'customerId', select: 'name profileImage' },
      { path: 'workerId', select: 'name' },
    ]);

    return successResponse(res, populatedReview, 'Review created successfully', 201);
  } catch (error) {
    errorResponse(res, error, 'Failed to create review', 500);
  }
};

// @route   GET /api/reviews/worker/:workerId
// @desc    Get all reviews for a worker
// @access  Public
export const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { page = 1, limit = 10, sortBy = 'recent' } = req.query;

    const { skip } = getPaginationParams({ page, limit });

    const sortOptions = {
      recent: { createdAt: -1 },
      helpful: { helpful: -1 },
      rating_high: { rating: -1 },
      rating_low: { rating: 1 },
    };

    const reviews = await Review.find({ workerId, isPublished: true })
      .populate('customerId', anonymousReview ? 'profileImage' : 'name profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions[sortBy] || { createdAt: -1 });

    const total = await Review.countDocuments({ workerId, isPublished: true });

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { workerId: require('mongoose').Types.ObjectId(workerId), isPublished: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    return successResponse(res, {
      reviews,
      ratingDistribution,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch reviews', 500);
  }
};

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('customerId', 'name profileImage')
      .populate('workerId', 'name')
      .populate('categoryId', 'name');

    if (!review) {
      return errorResponse(res, 'Review not found', 'Review not found', 404);
    }

    return successResponse(res, review);
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch review', 500);
  }
};

// @route   PUT /api/reviews/:id
// @desc    Update review (only by author)
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, pros, cons, wouldRecommend, images } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Review not found', 'Review not found', 404);
    }

    if (review.customerId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized', 'Only author can update review', 403);
    }

    // Update fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;
    if (wouldRecommend !== undefined) review.wouldRecommend = wouldRecommend;
    if (images) review.images = images;

    await review.save();

    // Update worker ratings
    const allReviews = await Review.find({ workerId: review.workerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await WorkerProfile.findByIdAndUpdate(review.workerProfileId, {
      'ratings.average': avgRating,
      'ratings.total': allReviews.reduce((sum, r) => sum + r.rating, 0),
      'ratings.count': allReviews.length,
    });

    return successResponse(res, review, 'Review updated successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to update review', 500);
  }
};

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Review not found', 'Review not found', 404);
    }

    if (review.customerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized', 'Cannot delete this review', 403);
    }

    await Review.findByIdAndDelete(id);

    // Revert booking status
    await Booking.findByIdAndUpdate(review.bookingId, { status: 'completed' });

    return successResponse(res, {}, 'Review deleted successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to delete review', 500);
  }
};

// @route   PUT /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Public
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful = true } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { [helpful ? 'helpful' : 'unhelpful']: 1 } },
      { new: true }
    );

    return successResponse(res, review, 'Thank you for your feedback');
  } catch (error) {
    errorResponse(res, error, 'Failed to update helpful', 500);
  }
};
