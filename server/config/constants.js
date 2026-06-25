// Load environment variables FIRST before accessing process.env
require('dotenv').config();

// Environment variables with defaults
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
};

// Validation rules
const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,

  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,

  DONATION_MIN_AMOUNT: 1,
  DONATION_MAX_AMOUNT: 1000000,

  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  OBJECT_ID_REGEX: /^[0-9a-fA-F]{24}$/,
};

// User roles
const USER_ROLES = {
  VOLUNTEER: 'volunteer',
  NGO: 'ngo',
  ADMIN: 'admin',
};

// Payment configuration
const PAYMENT_CONFIG = {
  SUCCESS_RATE: 0.95,

  STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },

  CURRENCY: 'INR',
  MOCK_KEY: 'MOCK_RAZORPAY_KEY',
};

// NGO status
const NGO_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// ✅ Rate limiting configuration (DISABLED FOR DEVELOPMENT)
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: ENV.NODE_ENV === 'development' ? 1000000 : 100,

  AUTH_WINDOW_MS: 15 * 60 * 1000,
  AUTH_MAX_REQUESTS: ENV.NODE_ENV === 'development' ? 1000000 : 5,
};

// Database configuration
const DB_CONFIG = {
  OPTIONS: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },

  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 5000,
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_REQUIRED: 'No token provided. Use Authorization: Bearer <token>',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',

  REQUIRED_FIELDS: 'Required fields are missing',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  INVALID_AMOUNT: 'Invalid donation amount',

  USER_NOT_FOUND: 'User not found',
  NGO_NOT_FOUND: 'NGO not found',
  EVENT_NOT_FOUND: 'Event not found',
  DONATION_NOT_FOUND: 'Donation not found',

  EMAIL_EXISTS: 'Email already registered',
  NGO_EXISTS: 'NGO already exists with this email',
  ALREADY_REGISTERED: 'You have already registered for this event',

  SERVER_ERROR: 'Internal server error',
  DB_CONNECTION_ERROR: 'Database connection failed',
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  DONATION_SUCCESS: 'Donation successful',
  PAYMENT_VERIFIED: 'Payment verified successfully',
  EVENT_CREATED: 'Event created successfully',
  NGO_REGISTERED: 'NGO registered successfully',
  NGO_APPROVED: 'NGO approved successfully',
};

module.exports = {
  ENV,
  VALIDATION,
  USER_ROLES,
  PAYMENT_CONFIG,
  NGO_STATUS,
  RATE_LIMIT,
  DB_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
