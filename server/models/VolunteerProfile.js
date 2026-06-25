const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profession: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  skills: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  availability: {
    type: String,
    trim: true
  },
  interests: [{
    type: String,
    enum: ['environment', 'education', 'healthcare', 'food', 'elderly', 'animals', 'disaster', 'community', 'arts', 'sports']
  }],
  joinedNgos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  }],
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio must not exceed 500 characters']
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema);
