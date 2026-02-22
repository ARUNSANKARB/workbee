import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
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

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      default: null,
    },

    workerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'in_progress',
        'completed',
        'reviewed',
        'rejected',
        'cancelled',
      ],
      default: 'pending',
    },

    serviceDescription: {
      type: String,
      required: [true, 'Please provide service description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    bookingDate: {
      type: Date,
      required: [true, 'Please provide booking date'],
    },

    estimatedCompletionDate: {
      type: Date,
      required: true,
    },

    actualCompletionDate: {
      type: Date,
      default: null,
    },

    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: [0, 'Amount cannot be negative'],
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'bank_transfer', 'cash'],
      default: 'upi',
    },

    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },

    workerNotes: {
      type: String,
      maxlength: [500, 'Worker notes cannot exceed 500 characters'],
      default: '',
    },

    images: {
      type: [String],
      default: [],
    },

    cancellationReason: {
      type: String,
      default: '',
    },

    cancelledBy: {
      type: String,
      enum: ['customer', 'worker', 'admin', null],
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      address: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
