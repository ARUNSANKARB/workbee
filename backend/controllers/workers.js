import { WorkerProfile, User, ServiceCategory } from '../models/index.js';
import { successResponse, errorResponse, getPaginationParams } from '../utils/helpers.js';

// @route   POST /api/workers/profile
// @desc    Create or update worker profile
// @access  Private (worker only)
export const createUpdateWorkerProfile = async (req, res) => {
  try {
    const {
      bio,
      skills,
      category,
      experience,
      serviceRate,
      location,
      availability,
    } = req.body;

    let profile = await WorkerProfile.findOne({ userId: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await WorkerProfile.findByIdAndUpdate(
        profile._id,
        {
          bio,
          skills,
          category,
          experience,
          serviceRate,
          location,
          availability,
        },
        { new: true, runValidators: true }
      ).populate('category');
    } else {
      // Create new profile
      profile = await WorkerProfile.create({
        userId: req.user._id,
        bio,
        skills,
        category,
        experience,
        serviceRate,
        location,
        availability,
      });
      profile = await profile.populate('category');
    }

    return successResponse(res, profile, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to update profile', 500);
  }
};

// @route   GET /api/workers/:id
// @desc    Get worker profile by ID
// @access  Public
export const getWorkerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await WorkerProfile.findOne({ userId: id })
      .populate('userId', 'name email phone profileImage')
      .populate('category', 'name icon image');

    if (!profile) {
      return errorResponse(res, 'Worker not found', 'Worker profile not found', 404);
    }

    return successResponse(res, profile);
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch worker profile', 500);
  }
};

// @route   GET /api/workers/category/:categoryId
// @desc    Get workers by category with pagination
// @access  Public
export const getWorkersByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, search, rating } = req.query;

    const { skip } = getPaginationParams({ page, limit });

    const query = {
      category: categoryId,
      isApproved: true,
    };

    if (search) {
      query.$text = { $search: search };
    }

    if (rating) {
      query['ratings.average'] = { $gte: parseFloat(rating) };
    }

    const workers = await WorkerProfile.find(query)
      .populate('userId', 'name profileImage phone')
      .populate('category', 'name icon')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'ratings.average': -1 });

    const total = await WorkerProfile.countDocuments(query);

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
    errorResponse(res, error, 'Failed to fetch workers', 500);
  }
};

// @route   GET /api/workers/search
// @desc    Search workers by skill/location
// @access  Public
export const searchWorkers = async (req, res) => {
  try {
    const { query, latitude, longitude, radius = 50, page = 1, limit = 10 } = req.query;

    const { skip } = getPaginationParams({ page, limit });

    const searchQuery = {
      isApproved: true,
    };

    if (query) {
      searchQuery.$or = [
        { skills: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
      ];
    }

    if (latitude && longitude) {
      searchQuery['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    const workers = await WorkerProfile.find(searchQuery)
      .populate('userId', 'name profileImage phone location')
      .populate('category', 'name icon')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'ratings.average': -1 });

    const total = await WorkerProfile.countDocuments(searchQuery);

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
    errorResponse(res, error, 'Failed to search workers', 500);
  }
};

// @route   POST /api/workers/upload-document
// @desc    Upload verification document
// @access  Private (worker only)
export const uploadDocument = async (req, res) => {
  try {
    const { documentType, documentUrl } = req.body;

    const profile = await WorkerProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return errorResponse(res, 'Worker profile not found', 'Please create a worker profile first', 404);
    }

    const document = {
      type: documentType,
      url: documentUrl,
      verificationStatus: 'pending',
    };

    profile.documents.push(document);
    await profile.save();

    return successResponse(res, profile, 'Document uploaded successfully', 201);
  } catch (error) {
    errorResponse(res, error, 'Failed to upload document', 500);
  }
};

// @route   PUT /api/workers/availability
// @desc    Update worker availability
// @access  Private (worker only)
export const updateAvailability = async (req, res) => {
  try {
    const { daysOfWeek, timeSlots, isAvailable } = req.body;

    const profile = await WorkerProfile.findByIdAndUpdate(
      { userId: req.user._id },
      {
        'availability.daysOfWeek': daysOfWeek,
        'availability.timeSlots': timeSlots,
        'availability.isAvailable': isAvailable,
      },
      { new: true }
    );

    return successResponse(res, profile, 'Availability updated successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to update availability', 500);
  }
};

// @route   GET /api/workers/reviews/:id
// @desc    Get worker reviews
// @access  Public
export const getWorkerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { skip } = getPaginationParams({ page, limit });

    const Review = require('../models/Review.js').default;

    const reviews = await Review.find({ workerId: id })
      .populate('customerId', 'name profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ workerId: id });

    return successResponse(res, {
      reviews,
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

// @route   GET /api/workers/earnings/:id
// @desc    Get worker earnings dashboard
// @access  Private (worker only)
export const getEarningsDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify user is viewing their own earnings
    if (req.user._id.toString() !== id) {
      return errorResponse(res, 'Unauthorized', 'Cannot view other earnings', 403);
    }

    const profile = await WorkerProfile.findOne({ userId: id });

    if (!profile) {
      return errorResponse(res, 'Worker profile not found', 'Worker profile not found', 404);
    }

    const Booking = require('../models/Booking.js').default;

    const completedBookings = await Booking.countDocuments({
      workerId: id,
      status: 'completed',
    });

    const totalEarnings = await Booking.aggregate([
      { $match: { workerId: id, status: 'completed', paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return successResponse(res, {
      profile,
      completedBookings,
      totalEarnings: totalEarnings[0]?.total || 0,
      monthlyStats: [], // Can be enhanced with monthly breakdowns
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch earnings', 500);
  }
};
