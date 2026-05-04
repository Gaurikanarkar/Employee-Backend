const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: String, // Can be changed to ObjectId if we want strict reference
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['Hour', 'Fix', 'Month', 'Year'],
    default: 'Hour'
  },
  qty: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
