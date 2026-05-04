const express = require('express');
const router = express.Router();
const { getAllTasks, getMyTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');

router.get('/', getAllTasks);
router.get('/my-tasks', getMyTasks);
router.post('/', createTask);
router.put('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;