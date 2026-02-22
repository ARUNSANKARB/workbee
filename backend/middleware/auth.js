import { verifyToken, extractToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/helpers.js';
import { User } from '../models/index.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return errorResponse(
        res,
        'No token provided',
        'Authorization token required',
        401
      );
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'User not found', 'Invalid token', 401);
    }

    if (user.isSuspended) {
      return errorResponse(
        res,
        'Account suspended',
        'Your account has been suspended',
        403
      );
    }

    req.user = user;
    next();
  } catch (error) {
    errorResponse(res, error, 'Authentication failed', 401);
  }
};

// Restrict to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Access denied',
        `Only ${roles.join(', ')} can access this route`,
        403
      );
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};
