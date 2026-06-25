const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GET all NGOs (for admin approval)
router.get('/ngos', async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch NGOs', error: err.message });
  }
});

// Update NGO Status (Approve/Reject)
router.put('/approve/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
       // Default to approved if no status provided, for backward compatibility
       if (!status) {
         // Proceed with 'approved'
       } else {
         return res.status(400).json({ message: 'Invalid status' });
       }
    }

    const finalStatus = status || 'approved';

    const ngo = await NGO.findByIdAndUpdate(
      req.params.id, 
      { status: finalStatus },
      { new: true }
    );
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    
    res.json({ message: `NGO ${finalStatus}`, ngo });
  } catch (err) {
    res.status(500).json({ message: 'Error updating NGO status', error: err.message });
  }
});

module.exports = router;
