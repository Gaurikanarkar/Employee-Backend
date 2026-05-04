const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newEmployee = await User.create({
      name,
      email,
      password: hashed,
      role: 'employee',
      department: department || 'General'
    });

    res.status(201).json({ id: newEmployee._id, name: newEmployee.name, email: newEmployee.email });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};