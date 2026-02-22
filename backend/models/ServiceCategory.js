import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },

    description: {
      type: String,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },

    icon: {
      type: String,
      default: '🔧',
    },

    image: {
      type: String,
      default:
        'https://res.cloudinary.com/demo/image/upload/v1/service-default.png',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalWorkers: {
      type: Number,
      default: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },

    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
serviceCategorySchema.index({ name: 1 });
serviceCategorySchema.index({ isActive: 1 });

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

export default ServiceCategory;
