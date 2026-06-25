const mongoose = require('mongoose');
const { PAYMENT_CONFIG, VALIDATION } = require('../config/constants');

const donationSchema = new mongoose.Schema({
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Donor is required']
  },
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'],
    min: [VALIDATION.DONATION_MIN_AMOUNT, `Amount must be at least ₹${VALIDATION.DONATION_MIN_AMOUNT}`],
    max: [VALIDATION.DONATION_MAX_AMOUNT, `Amount must not exceed ₹${VALIDATION.DONATION_MAX_AMOUNT}`]
  },
  ngo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'NGO', 
    required: [true, 'NGO is required']
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
    default: null
  },
  // Payment tracking fields
  paymentId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true
  },
  orderId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: {
      values: Object.values(PAYMENT_CONFIG.STATUS),
      message: '{VALUE} is not a valid payment status'
    },
    default: PAYMENT_CONFIG.STATUS.PENDING
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
// Note: paymentId and orderId unique indexes are from schema definition
donationSchema.index({ donor: 1, createdAt: -1 }); // For donor's donation history
donationSchema.index({ ngo: 1, createdAt: -1 }); // For NGO's received donations
donationSchema.index({ paymentStatus: 1 }); // For filtering by status
donationSchema.index({ event: 1 }); // For event-specific donations

// Compound index for common queries
donationSchema.index({ ngo: 1, paymentStatus: 1, createdAt: -1 });

/**
 * Virtual property for formatted amount in INR
 */
donationSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

/**
 * Virtual property for date alias (for backward compatibility)
 */
donationSchema.virtual('date').get(function() {
  return this.createdAt;
});

/**
 * Instance method to check if donation is completed
 * @returns {boolean}
 */
donationSchema.methods.isCompleted = function() {
  return this.paymentStatus === PAYMENT_CONFIG.STATUS.COMPLETED;
};

/**
 * Instance method to check if donation is pending
 * @returns {boolean}
 */
donationSchema.methods.isPending = function() {
  return this.paymentStatus === PAYMENT_CONFIG.STATUS.PENDING;
};

/**
 * Static method to get total donations for an NGO
 * @param {ObjectId} ngoId - NGO ID
 * @returns {Promise<number>} Total donation amount
 */
donationSchema.statics.getTotalForNGO = async function(ngoId) {
  const result = await this.aggregate([
    { 
      $match: { 
        ngo: ngoId, 
        paymentStatus: PAYMENT_CONFIG.STATUS.COMPLETED 
      } 
    },
    { 
      $group: { 
        _id: null, 
        total: { $sum: '$amount' } 
      } 
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

/**
 * Static method to get donation statistics
 * @returns {Promise<Object>} Donation statistics
 */
donationSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$paymentStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('Donation', donationSchema);