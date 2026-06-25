const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  ENV, 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  VALIDATION 
} = require('../config/constants');
const { validateEmail, validatePassword, validateName } = require('../utils/validation');

/**
 * POST /api/auth/register
 * Register a new user
 * Rate limited: 5 requests per 15 minutes (configured in index.js)
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      const error = new Error(ERROR_MESSAGES.REQUIRED_FIELDS);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      const error = new Error(nameValidation.error);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Validate email
    if (!validateEmail(email)) {
      const error = new Error(ERROR_MESSAGES.INVALID_EMAIL);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      const error = new Error(passwordValidation.error);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error(ERROR_MESSAGES.EMAIL_EXISTS);
      error.statusCode = HTTP_STATUS.CONFLICT;
      return next(error);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, ENV.BCRYPT_ROUNDS);

    // Create new user (model validation will also run)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'volunteer'
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRE }
    );

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
      token,
      user: newUser.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login user
 * Rate limited: 5 requests per 15 minutes (configured in index.js)
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const error = new Error(ERROR_MESSAGES.REQUIRED_FIELDS);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Validate email format
    if (!validateEmail(email)) {
      const error = new Error(ERROR_MESSAGES.INVALID_EMAIL);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      return next(error);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      return next(error);
    }

    // Generate JWT Token
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
});

module.exports = router;

