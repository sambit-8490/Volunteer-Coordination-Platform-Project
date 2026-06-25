const mongoose = require('mongoose');
const { NGO_STATUS, VALIDATION } = require('../config/constants');

const ngoSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'NGO name is required'],
    trim: true,
    minlength: [VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`]
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return VALIDATION.EMAIL_REGEX.test(v);
      },
      message: 'Invalid email format'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description must not exceed 1000 characters']
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['environment', 'education', 'healthcare', 'food', 'elderly', 'animals', 'disaster', 'community'],
    trim: true
  },
  mission: {
    type: String,
    trim: true,
    maxlength: [500, 'Mission statement must not exceed 500 characters']
  },
  // Consolidated status field (replaces isApproved)
  status: {
    type: String,
    enum: {
      values: Object.values(NGO_STATUS),
      message: '{VALUE} is not a valid status'
    },
    default: NGO_STATUS.PENDING
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance (email unique index is from schema definition)
ngoSchema.index({ status: 1 }); // For filtering by approval status
ngoSchema.index({ userId: 1 }); // For user's NGO lookup
ngoSchema.index({ createdAt: -1 }); // For sorting by creation date

/**
 * Virtual property for backward compatibility with isApproved
 */
ngoSchema.virtual('isApproved').get(function() {
  return this.status === NGO_STATUS.APPROVED;
});

/**
 * Instance method to approve NGO
 */
ngoSchema.methods.approve = function() {
  this.status = NGO_STATUS.APPROVED;
  return this.save();
};

/**
 * Instance method to reject NGO
 */
ngoSchema.methods.reject = function() {
  this.status = NGO_STATUS.REJECTED;
  return this.save();
};

/**
 * Static method to find approved NGOs
 * @returns {Promise<Array>} Array of approved NGOs
 */
ngoSchema.statics.findApproved = function() {
  return this.find({ status: NGO_STATUS.APPROVED }).lean();
};

/**
 * Static method to find pending NGOs
 * @returns {Promise<Array>} Array of pending NGOs
 */
ngoSchema.statics.findPending = function() {
  return this.find({ status: NGO_STATUS.PENDING }).lean();
};

module.exports = mongoose.model('NGO', ngoSchema);
