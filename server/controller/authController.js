/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ENV, HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { name, email, password, role }
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, ENV.BCRYPT_ROUNDS);

    // Create new user (validation happens in model)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRE }
    );

    // User model's toJSON method automatically excludes password
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
      token,
      user: newUser
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      error.message = ERROR_MESSAGES.EMAIL_EXISTS;
      error.statusCode = HTTP_STATUS.CONFLICT;
    }
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      return next(error);
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      return next(error);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRE }
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};
