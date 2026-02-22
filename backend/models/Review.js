import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    workerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
    },

    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },

    comment: {
      type: String,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      default: '',
    },

    pros: {
      type: [String],
      default: [],
    },

    cons: {
      type: [String],
      default: [],
    },

    wouldRecommend: {
      type: Boolean,
      default: true,
    },

    images: {
      type: [String],
      default: [],
    },

    helpful: {
      type: Number,
      default: 0,
    },

    unhelpful: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    anonymousReview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
reviewSchema.index({ workerId: 1, createdAt: -1 });
reviewSchema.index({ customerId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ bookingId: 1 });

// Prevent duplicate reviews for same booking
reviewSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingReview = await Review.findOne({
      bookingId: this.bookingId,
    });
    if (existingReview) {
      throw new Error('Review already exists for this booking');
    }
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
