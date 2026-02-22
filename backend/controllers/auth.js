import { User, WorkerProfile, ServiceCategory } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(
        res,
        'Email already registered',
        'This email is already in use',
        409
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
    });

    // If worker role, create worker profile
    if (user.role === 'worker') {
      const electricianCategory = await ServiceCategory.findOne({
        name: 'Electrician',
      });
      
      await WorkerProfile.create({
        userId: user._id,
        category: electricianCategory?._id || null,
        skills: ['General'],
        serviceRate: 0,
      });
    }

    // Generate token
    const token = generateToken({ id: user._id, role: user.role });

    return successResponse(
      res,
      {
        user: user.toJSON(),
        token,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    errorResponse(res, error, 'Registration failed', 500);
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse(
        res,
        'Invalid credentials',
        'Email or password is incorrect',
        401
      );
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return errorResponse(
        res,
        'Invalid credentials',
        'Email or password is incorrect',
        401
      );
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return errorResponse(
        res,
        'Account suspended',
        'Your account has been suspended by admin',
        403
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ id: user._id, role: user.role });

    return successResponse(res, {
      user: user.toJSON(),
      token,
    }, 'Login successful');
  } catch (error) {
    errorResponse(res, error, 'Login failed', 500);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (token invalidation handled on frontend)
// @access  Private
export const logout = async (req, res) => {
  try {
    return successResponse(res, {}, 'Logout successful');
  } catch (error) {
    errorResponse(res, error, 'Logout failed', 500);
  }
};

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let profile = null;
    if (user.role === 'worker') {
      profile = await WorkerProfile.findOne({ userId: user._id }).populate(
        'category'
      );
    }

    return successResponse(res, {
      user: user.toJSON(),
      profile,
    });
  } catch (error) {
    errorResponse(res, error, 'Failed to fetch user', 500);
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, profileImage, location },
      { new: true, runValidators: true }
    );

    return successResponse(res, user.toJSON(), 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to update profile', 500);
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    
    if (!isPasswordCorrect) {
      return errorResponse(
        res,
        'Invalid password',
        'Current password is incorrect',
        401
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return successResponse(res, {}, 'Password changed successfully');
  } catch (error) {
    errorResponse(res, error, 'Failed to change password', 500);
  }
};

// @route   GET /api/auth/verify-email
// @desc    Verify email (placeholder - implement with email service)
// @access  Private
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isVerified: true },
      { new: true }
    );

    return successResponse(res, user.toJSON(), 'Email verified successfully');
  } catch (error) {
    errorResponse(res, error, 'Email verification failed', 500);
  }
};
