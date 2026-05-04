const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Import Notification


// REPLACE THIS WITH YOUR ACTUAL ADMIN USER'S _id FROM MONGODB COMPASS
const ADMIN_ID = '69e125e3b144577ee40017c3'; 

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, deadline } = req.body;
    
    if (!title || !assignedTo || !deadline) {
      return res.status(400).json({ msg: 'Title, Assignee, and Deadline are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ msg: 'Invalid Employee ID format.' });
    }

    const employee = await User.findById(assignedTo);
    if (!employee) return res.status(404).json({ msg: 'Employee not found.' });

    const newTask = new Task({
      title,
      description: description || '',
      assignedTo,
      createdBy: ADMIN_ID, 
      priority: priority || 'medium',
      deadline,
      status: 'todo'
    });

    const savedTask = await newTask.save();

    // TC-05: Create In-App Notification (No Email)
    await Notification.create({
      userId: assignedTo,
      taskId: savedTask._id,
      message: `New task assigned: "${title}"`,
      type: 'assigned'
    });

    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Task Creation Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ msg: 'User ID required' });

    const tasks = await Task.find({ assignedTo: userId })
      .populate('createdBy', 'name')
      .sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { status, updatedAt: Date.now() }, 
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ msg: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};