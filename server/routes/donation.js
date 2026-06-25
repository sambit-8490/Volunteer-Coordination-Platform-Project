const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * POST /api/donate
 * Create a new donation
 * Auth: Required
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { ngoId, amount, currency, paymentId, orderId, eventId } = req.body;
    const donor = req.user.id; // From verifyToken

    // Basic Validation
    if (!ngoId) {
      const error = new Error('NGO ID is required');
      error.statusCode = 400;
      return next(error);
    }

    if (!amount || amount < 1) {
      const error = new Error('Invalid donation amount');
      error.statusCode = 400;
      return next(error);
    }

    // Verify NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      const error = new Error('NGO not found');
      error.statusCode = 404;
      return next(error);
    }

    // Create Donation
    const donation = new Donation({
      donor,
      ngo: ngoId,
      event: eventId || null,
      amount,
      // paymentId, // Optional: if integrating real payment gateway later
      // orderId,   // Optional
      paymentStatus: 'completed' // Mocking successful payment for now
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation successful',
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/donate/ngo/:ngoId
 * Get donations for a specific NGO
 * Auth: Required (Should strictly be NGO owner or Admin, but keeping open for now per plan)
 */
router.get('/ngo/:ngoId', verifyToken, async (req, res, next) => {
  try {
    const { ngoId } = req.params;

    // Optional: Add ownership check here if we want to restrict viewing
    // const ngo = await NGO.findById(ngoId);
    // if (ngo.userId.toString() !== req.user.id) ...

    const donations = await Donation.find({ ngo: ngoId })
      .populate('donor', 'name email')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/donate/my
 * Get donations made by the authenticated user
 * Auth: Required
 */
router.get('/my', verifyToken, async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('ngo', 'name')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/donate
 * Get all donations (Admin use mostly)
 * Auth: Required
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('ngo', 'name')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/donate/:donationId
 * Get a specific donation by ID
 */
router.get('/:donationId', verifyToken, async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.donationId)
      .populate('donor', 'name email')
      .populate('ngo', 'name');

    if (!donation) {
      const error = new Error('Donation not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
