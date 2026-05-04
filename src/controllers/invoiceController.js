const Invoice = require('../models/Invoice');

// Helper to generate Invoice Number
const generateInvoiceNumber = async (category, projectCode, financialYear, type) => {
  const count = await Invoice.countDocuments({ financialYear });
  const sequence = String(count + 1).padStart(3, '0');
  const typeCode = type === 'INV' ? 'INV' : 'PI';
  return `AAI/${typeCode}/${category.toUpperCase()}/${projectCode}/${financialYear}/${sequence}`;
};

exports.getInvoices = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const invoices = await Invoice.find(query)
      .populate('client', 'organization')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { category, projectCode, financialYear, type } = req.body;
    const invoiceNumber = await generateInvoiceNumber(category, projectCode, financialYear, type);
    
    const newInvoice = new Invoice({
      ...req.body,
      invoiceNumber
    });

    const invoice = await newInvoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client').populate('quotationRef');
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ msg: 'Invoice deactivated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
