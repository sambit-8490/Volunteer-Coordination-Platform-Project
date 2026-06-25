const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const NGO = require('../models/NGO');
const { verifyToken } = require('../middleware/authMiddleware');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');

/**
 * Create a new event
 * POST /api/event
 * Auth: Required (NGO only)
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { title, description, date, location, maxVolunteers } = req.body;

    // Find NGO associated with the user
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Create event
    const event = new Event({ 
      title, 
      description, 
      date, 
      location, 
      ngo: ngo._id,
      maxVolunteers: maxVolunteers || 50
    });
    
    await event.save();
    
    res.status(HTTP_STATUS.CREATED).json({ 
      success: true,
      message: SUCCESS_MESSAGES.EVENT_CREATED, 
      data: event 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all events
 * GET /api/event
 * Auth: Not required
 */
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('ngo', 'name email description address phone website mission category')
      .sort({ date: 1 })
      .lean();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get events created by a specific NGO
 * GET /api/event/ngo/:ngoId
 * Auth: Not required
 */
router.get('/ngo/:ngoId', async (req, res, next) => {
  try {
    const events = await Event.find({ ngo: req.params.ngoId })
      .sort({ date: -1 })
      .lean();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get events created by the authenticated user's NGO
 * GET /api/event/my
 * Auth: Required (NGO only)
 */
router.get('/my', verifyToken, async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      const error = new Error(ERROR_MESSAGES.NGO_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    const events = await Event.find({ ngo: ngo._id })
      .populate('volunteers', 'name email')
      .sort({ date: -1 })
      .lean();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a single event by ID
 * GET /api/event/:id
 * Auth: Not required
 */
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('ngo', 'name email description address phone website mission category')
      .populate('volunteers', 'name email');
    
    if (!event) {
      const error = new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update an event
 * PUT /api/event/:id
 * Auth: Required (NGO owner only)
 */
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      const error = new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify ownership
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo || event.ngo.toString() !== ngo._id.toString()) {
      const error = new Error(ERROR_MESSAGES.FORBIDDEN);
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      return next(error);
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Event updated successfully', 
      data: updated 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete an event
 * DELETE /api/event/:id
 * Auth: Required (NGO owner only)
 */
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      const error = new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Verify ownership
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo || event.ngo.toString() !== ngo._id.toString()) {
      const error = new Error(ERROR_MESSAGES.FORBIDDEN);
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      return next(error);
    }

    await Event.findByIdAndDelete(req.params.id);
    
    res.status(HTTP_STATUS.OK).json({ 
      success: true,
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Register a volunteer for an event
 * POST /api/event/:id/register
 * Auth: Required (Volunteer only)
 */
router.post('/:id/register', verifyToken, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      const error = new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Use the model's addVolunteer method
    try {
      await event.addVolunteer(req.user.id);
      
      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        message: 'Successfully registered for event',
        data: event
      });
    } catch (err) {
      // Handle specific errors from addVolunteer
      const error = new Error(err.message);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Volunteer for an event (alias for register)
 * PUT /api/event/join/:id
 * Auth: Required (Volunteer only)
 */
router.put('/join/:id', verifyToken, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      const error = new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      return next(error);
    }

    // Use the model's addVolunteer method
    try {
      await event.addVolunteer(req.user.id);
      
      res.status(HTTP_STATUS.OK).json({ 
        success: true,
        message: 'Joined successfully',
        data: event
      });
    } catch (err) {
      const error = new Error(err.message);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

