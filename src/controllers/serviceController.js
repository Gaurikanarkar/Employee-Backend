const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createService = async (req, res) => {
  try {
    const newService = new Service(req.body);
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Service removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
