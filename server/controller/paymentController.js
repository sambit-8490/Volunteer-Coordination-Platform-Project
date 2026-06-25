/**
 * Fake Payment System Controller
 * Simulates Razorpay-like payment flow
 * Replace with real Razorpay integration later
 */

const Donation = require('../models/Donation');
const User = require('../models/User');
const NGO = require('../models/NGO');
const { PAYMENT_CONFIG, HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Generate a unique payment ID
 * @returns {string} Fake payment ID
 */
const generatePaymentId = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).slice(2, 11);
  return `pay_${timestamp}_${randomStr}`;
};

/**
 * Generate a unique order ID
 * @returns {string} Fake order ID
 */
const generateOrderId = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).slice(2, 11);
  return `order_${timestamp}_${randomStr}`;
};

/**
 * Initiate a fake payment
 * POST /api/payment/initiate
 * Body: { amount, ngoId, eventId?, donorId? }
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { amount, ngoId, eventId } = req.body;
    const donorId = req.user ? req.user.id : null;

    // Validation
    if (!amount || amount < 1) {
      const error = new Error('Invalid amount');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    if (!ngoId) {
      const error = new Error('NGO ID is required');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Check if NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Generate fake payment IDs (Razorpay-like format)
    const orderId = generateOrderId();
    const paymentId = generatePaymentId();

    // Create donation record with pending status
    const donation = new Donation({
      donor: donorId,
      amount,
      ngo: ngoId,
      event: eventId || null,
      orderId,
      paymentId,
      paymentStatus: PAYMENT_CONFIG.STATUS.PENDING
    });

    await donation.save();

    // Log payment initiation (for debugging)
    console.log(`💳 Payment initiated: ${paymentId} for ₹${amount}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Payment initiated',
      data: {
        orderId,
        paymentId,
        amount,
        ngoId,
        donationId: donation._id,
        // Razorpay-like response
        key: PAYMENT_CONFIG.MOCK_KEY,
        amount_in_paise: amount * 100,
        currency: PAYMENT_CONFIG.CURRENCY
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify fake payment
 * POST /api/payment/verify
 * Body: { paymentId, orderId, donationId }
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, donationId } = req.body;

    if (!paymentId || !orderId || !donationId) {
      const error = new Error('Missing payment verification details');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Find donation
    const donation = await Donation.findById(donationId)
      .populate('donor', 'name email')
      .populate('ngo', 'name')
      .populate('event', 'title');

    if (!donation) {
      const error = new Error(ERROR_MESSAGES.DONATION_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify payment IDs match
    if (donation.paymentId !== paymentId || donation.orderId !== orderId) {
      const error = new Error('Payment verification failed: IDs mismatch');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }

    // Simulate payment success rate (95% success for testing)
    const isSuccess = Math.random() < PAYMENT_CONFIG.SUCCESS_RATE;

    if (!isSuccess) {
      donation.paymentStatus = PAYMENT_CONFIG.STATUS.FAILED;
      await donation.save();

      console.log(`❌ Payment failed: ${paymentId}`);

      const error = new Error('Payment failed. Please try again.');
      error.statusCode = HTTP_STATUS.PAYMENT_REQUIRED;
      return next(error);
    }

    // Update donation status to completed
    donation.paymentStatus = PAYMENT_CONFIG.STATUS.COMPLETED;
    await donation.save();

    console.log(`✅ Payment verified: ${paymentId} for ₹${donation.amount}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.PAYMENT_VERIFIED,
      data: {
        donationId: donation._id,
        paymentId,
        orderId,
        amount: donation.amount,
        status: PAYMENT_CONFIG.STATUS.COMPLETED,
        donor: donation.donor,
        ngo: donation.ngo,
        event: donation.event,
        date: donation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get donation status
 * GET /api/payment/:donationId
 */
exports.getDonationStatus = async (req, res, next) => {
  try {
    const { donationId } = req.params;

    const donation = await Donation.findById(donationId)
      .populate('donor', 'name email')
      .populate('ngo', 'name')
      .populate('event', 'title');

    if (!donation) {
      const error = new Error(ERROR_MESSAGES.DONATION_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};
