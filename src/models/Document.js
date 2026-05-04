const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  file: {
    originalName: String,
    filename: String,
    path: String,
    size: Number,
    mimetype: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'changes-required'],
    default: 'pending',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adminComment: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
