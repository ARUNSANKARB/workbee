import mongoose from 'mongoose';

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },

    skills: {
      type: [String],
      required: [true, 'Please provide at least one skill'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one skill is required',
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      default: null,
    },

    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      max: [60, 'Experience cannot exceed 60 years'],
      default: 0,
    },

    serviceRate: {
      type: Number,
      required: [true, 'Please provide a service rate'],
      min: [0, 'Service rate cannot be negative'],
    },

    documents: [
      {
        type: {
          type: String,
          enum: ['aadhar', 'pan', 'driving_license', 'passport', 'skill_certificate'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        verificationStatus: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        rejectionReason: {
          type: String,
          default: '',
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verifiedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    availability: {
      daysOfWeek: {
        type: [Number], // 0-6 (Sunday to Saturday)
        default: [1, 2, 3, 4, 5], // Monday to Friday
      },
      timeSlots: [
        {
          startTime: String, // HH:mm format
          endTime: String,
        },
      ],
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },

    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    totalBookings: {
      type: Number,
      default: 0,
    },

    completedBookings: {
      type: Number,
      default: 0,
    },

    earnings: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: '',
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

// Index for location-based queries
workerProfileSchema.index({ 'location.coordinates': '2dsphere' });
workerProfileSchema.index({ category: 1 });
workerProfileSchema.index({ isApproved: 1 });
workerProfileSchema.index({ 'ratings.average': -1 });

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);

export default WorkerProfile;
