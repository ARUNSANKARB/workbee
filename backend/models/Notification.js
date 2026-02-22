import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['booking_request', 'booking_accepted', 'booking_rejected', 'booking_completed', 'review_received', 'payment_received', 'document_verified', 'system'],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: [true, 'Please provide notification message'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    relatedModel: {
      type: String,
      enum: ['Booking', 'Review', 'User', null],
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    actionUrl: {
      type: String,
      default: '',
    },

    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },

    sendEmail: {
      type: Boolean,
      default: false,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// Auto-mark old notifications as read after 90 days
notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 7776000, // 90 days
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
