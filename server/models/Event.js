const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title must not exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description must not exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(v) {
        // Allow past dates for existing events, only validate for new events
        return !this.isNew || v >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  location: {
    type: String,
    trim: true,
    required: [true, 'Event location is required']
  },
  ngo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'NGO',
    required: [true, 'NGO is required']
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }],
  maxVolunteers: {
    type: Number,
    min: [1, 'Maximum volunteers must be at least 1'],
    default: 50
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
eventSchema.index({ ngo: 1, date: -1 }); // For NGO's events sorted by date
eventSchema.index({ date: 1 }); // For upcoming events
eventSchema.index({ createdAt: -1 }); // For recent events
eventSchema.index({ volunteers: 1 }); // For volunteer's registered events

/**
 * Virtual property for volunteer count
 */
eventSchema.virtual('volunteerCount').get(function() {
  return this.volunteers ? this.volunteers.length : 0;
});

/**
 * Virtual property to check if event is full
 */
eventSchema.virtual('isFull').get(function() {
  return this.volunteerCount >= this.maxVolunteers;
});

/**
 * Virtual property to check if event is past
 */
eventSchema.virtual('isPast').get(function() {
  return this.date < new Date();
});

/**
 * Instance method to add volunteer
 * @param {ObjectId} userId - User ID to add
 * @returns {Promise<Event>} Updated event
 */
eventSchema.methods.addVolunteer = async function(userId) {
  if (this.isFull) {
    throw new Error('Event is full');
  }
  
  if (this.volunteers.includes(userId)) {
    throw new Error('User already registered for this event');
  }
  
  this.volunteers.push(userId);
  return this.save();
};

/**
 * Instance method to remove volunteer
 * @param {ObjectId} userId - User ID to remove
 * @returns {Promise<Event>} Updated event
 */
eventSchema.methods.removeVolunteer = async function(userId) {
  this.volunteers = this.volunteers.filter(
    id => id.toString() !== userId.toString()
  );
  return this.save();
};

/**
 * Instance method to check if user is registered
 * @param {ObjectId} userId - User ID to check
 * @returns {boolean}
 */
eventSchema.methods.isVolunteerRegistered = function(userId) {
  return this.volunteers.some(id => id.toString() === userId.toString());
};

/**
 * Static method to find upcoming events
 * @returns {Promise<Array>} Array of upcoming events
 */
eventSchema.statics.findUpcoming = function() {
  return this.find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .populate('ngo', 'name')
    .lean();
};

/**
 * Static method to find events by NGO
 * @param {ObjectId} ngoId - NGO ID
 * @returns {Promise<Array>} Array of events
 */
eventSchema.statics.findByNGO = function(ngoId) {
  return this.find({ ngo: ngoId })
    .sort({ date: -1 })
    .populate('volunteers', 'name email')
    .lean();
};

module.exports = mongoose.model('Event', eventSchema);
