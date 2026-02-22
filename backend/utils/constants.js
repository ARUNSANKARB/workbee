// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin'
};

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REVIEWED: 'reviewed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// Document types for worker verification
export const DOCUMENT_TYPES = {
  AADHAR: 'aadhar',
  PAN: 'pan',
  DRIVING_LICENSE: 'driving_license',
  PASSPORT: 'passport',
  SKILL_CERTIFICATE: 'skill_certificate'
};

// Document verification statuses
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Service categories
export const SERVICE_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Maid',
  'Cook',
  'Catering',
  'AC Repair',
  'Carpenter',
  'Painter',
  'Beautician',
  'Mechanic'
];

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INVALID_TOKEN: 'Invalid or expired token',
  BOOKING_NOT_FOUND: 'Booking not found',
  WORKER_NOT_FOUND: 'Worker profile not found'
};
