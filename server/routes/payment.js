const express = require('express');
const router = express.Router();
const { 
  initiatePayment, 
  verifyPayment, 
  getDonationStatus 
} = require('../controller/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * POST /api/payment/initiate
 * Initiate a payment for donation
 * Body: { amount, ngoId, eventId?, donorId? }
 */
router.post('/initiate', async (req, res, next) => {
  // Make donation auth optional - can donate without login
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    verifyToken(req, res, () => initiatePayment(req, res, next));
  } else {
    initiatePayment(req, res, next);
  }
});

/**
 * POST /api/payment/verify
 * Verify payment and complete donation
 * Body: { paymentId, orderId, donationId }
 */
router.post('/verify', verifyPayment);

/**
 * GET /api/payment/:donationId
 * Get donation and payment status
 */
router.get('/:donationId', getDonationStatus);

module.exports = router;
