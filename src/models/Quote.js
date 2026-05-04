const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: String,
    required: true,
    unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  documentType: {
    type: String,
    enum: ['QTN', 'PO'],
    default: 'QTN'
  },
  validUntil: {
    type: Date
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  projectCode: {
    type: String,
    required: true
  },
  financialYear: {
    type: String,
    required: true
  },
  baseModuleRate: {
    type: Number,
    required: true,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  numberOfPeople: {
    type: Number,
    default: 1
  },
  additionalItems: [{
    description: String,
    amount: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
