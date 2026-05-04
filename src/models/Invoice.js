const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  quotationRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote'
  },
  type: {
    type: String,
    enum: ['INV', 'PI'],
    default: 'INV'
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
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid'
  },
  includePaymentMilestone: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Invoice', invoiceSchema);
