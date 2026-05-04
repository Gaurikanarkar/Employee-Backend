const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all employees (for Admin dropdown)
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('_id name email department');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;