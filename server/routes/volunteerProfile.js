const express = require('express');
const router = express.Router();
const VolunteerProfile = require('../models/VolunteerProfile');
const User = require('../models/User');
const { verifyToken, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/volunteer/profile
 * @desc    Create or update volunteer profile
 * @access  Private (Volunteer only)
 */
router.post('/profile', verifyToken, authorize('volunteer'), async (req, res) => {
  try {
    const { profession, experience, skills, education, location, availability, interests, bio } = req.body;

    // Find existing profile or create new one
    let profile = await VolunteerProfile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing profile
      profile.profession = profession;
      profile.experience = experience;
      profile.skills = skills;
      profile.education = education;
      profile.location = location;
      profile.availability = availability;
      profile.interests = interests;
      profile.bio = bio;
      await profile.save();
    } else {
      // Create new profile
      profile = new VolunteerProfile({
        userId: req.user.id,
        profession,
        experience,
        skills,
        education,
        location,
        availability,
        interests,
        bio
      });
      await profile.save();
    }

    // Mark onboarding as completed
    await User.findByIdAndUpdate(req.user.id, { onboardingCompleted: true });

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error saving volunteer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save profile',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/volunteer/profile
 * @desc    Get current user's volunteer profile
 * @access  Private (Volunteer only)
 */
router.get('/profile', verifyToken, authorize('volunteer'), async (req, res) => {
  try {
    const profile = await VolunteerProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching volunteer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

module.exports = router;
