const Quote = require('../models/Quote');

// Helper to generate Quote Number
const generateQuoteNumber = async (category, projectCode, financialYear) => {
  const lastQuote = await Quote.findOne({ financialYear }).sort({ createdAt: -1 });
  
  let nextSeq = 1;
  if (lastQuote && lastQuote.quoteNumber) {
    const parts = lastQuote.quoteNumber.split('/');
    const lastSeqNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeqNum)) {
      nextSeq = lastSeqNum + 1;
    } else {
      const count = await Quote.countDocuments({ financialYear });
      nextSeq = count + 1;
    }
  }

  const sequence = String(nextSeq).padStart(3, '0');
  return `AAI/QTN/${category.toUpperCase()}/${projectCode}/${financialYear}/${sequence}`;
};

exports.getQuotes = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { quoteNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const quotes = await Quote.find(query)
      .populate('client', 'organization')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createQuote = async (req, res) => {
  try {
    const { category, projectCode, financialYear } = req.body;
    const quoteNumber = await generateQuoteNumber(category, projectCode, financialYear);
    
    const newQuote = new Quote({
      ...req.body,
      quoteNumber
    });

    const quote = await newQuote.save();
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('client');
    if (!quote) return res.status(404).json({ msg: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ msg: 'Quote not found' });

    if (quote.status === 'active') {
      // Soft delete
      quote.status = 'inactive';
      await quote.save();
      return res.json({ msg: 'Quote deactivated' });
    } else {
      // Hard delete
      await Quote.findByIdAndDelete(req.params.id);
      return res.json({ msg: 'Quote permanently deleted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
