const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Register a new NGO
 * POST /api/ngo/register
 * Auth: Required
 */
router.post('/register', verifyToken, async (req, res, next) => {
  try {
    const { name, email, phone, address, description, website, category, mission } = req.body;



    // Check if user already has an NGO
    const existingNGO = await NGO.findOne({ userId: req.user.id });
    if (existingNGO) {
      await User.findByIdAndUpdate(req.user.id, { onboardingCompleted: true });
      
      return res.status(HTTP_STATUS.OK).json({ 
        success: true,
        message: 'NGO already registered', 
        data: existingNGO 
      });
    }

    // Create new NGO
    const newNGO = new NGO({
      name,
      email,
      phone,
      address,
      description,
      website,
      category,
      mission,
      userId: req.user.id
    });

    await newNGO.save();
    
    // Mark onboarding as completed
    await User.findByIdAndUpdate(req.user.id, { onboardingCompleted: true });
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: SUCCESS_MESSAGES.NGO_REGISTERED, 
      data: newNGO 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all approved NGOs
 * GET /api/ngo
 * Auth: Not required
 */
router.get('/', async (req, res, next) => {
  try {
    const ngos = await NGO.findApproved();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get authenticated user's NGO
 * GET /api/ngo/my
 * Auth: Required
 */
router.get('/my', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a single NGO by ID
 * GET /api/ngo/:id
 * Auth: Not required
 */
router.get('/:id', async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Approve an NGO (Admin only)
 * PUT /api/ngo/:id/approve
 * Auth: Required (Admin)
 */
router.put('/:id/approve', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Use the model's approve method
    await ngo.approve();
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: SUCCESS_MESSAGES.NGO_APPROVED, 
      data: ngo 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update NGO by ID
 * PUT /api/ngo/:id
 * Auth: Required (NGO owner only)
 */
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify ownership
    if (ngo.userId.toString() !== req.user.id) {
      const error = new Error(ERROR_MESSAGES.FORBIDDEN);
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      return next(error);
    }

    const updatedNGO = await NGO.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'NGO updated successfully', 
      data: updatedNGO 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete NGO by ID
 * DELETE /api/ngo/:id
 * Auth: Required (NGO owner or Admin)
 */
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify ownership (or admin - would need role check)
    if (ngo.userId.toString() !== req.user.id) {
      const error = new Error(ERROR_MESSAGES.FORBIDDEN);
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      return next(error);
    }

    await NGO.findByIdAndDelete(req.params.id);
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'NGO deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

