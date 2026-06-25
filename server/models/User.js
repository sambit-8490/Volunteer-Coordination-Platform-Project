const mongoose = require('mongoose');
const { USER_ROLES, VALIDATION } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`],
    maxlength: [VALIDATION.NAME_MAX_LENGTH, `Name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters`]
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return VALIDATION.EMAIL_REGEX.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`]
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || VALIDATION.PHONE_REGEX.test(v);
      },
      message: 'Invalid phone number format (must be 10 digits starting with 6-9)'
    }
  },
  role: { 
    type: String, 
    enum: {
      values: Object.values(USER_ROLES),
      message: '{VALUE} is not a valid role'
    },
    default: USER_ROLES.VOLUNTEER 
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  profileData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes are automatically created from schema definition
// email: unique index from schema
// Additional indexes for performance
userSchema.index({ role: 1 }); // Index for role-based queries
userSchema.index({ createdAt: -1 }); // Index for sorting by creation date

/**
 * Instance method to exclude password from JSON responses
 * Automatically called when converting document to JSON
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

/**
 * Instance method to get user's public profile
 * @returns {Object} Public user data
 */
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    onboardingCompleted: this.onboardingCompleted,
    createdAt: this.createdAt
  };
};

/**
 * Static method to find users by role
 * @param {string} role - User role to filter by
 * @returns {Promise<Array>} Array of users
 */
userSchema.statics.findByRole = function(role) {
  return this.find({ role }).select('-password').lean();
};

module.exports = mongoose.model('User', userSchema);
