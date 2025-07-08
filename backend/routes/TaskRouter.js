const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskController');

router.post('/create', taskController.createTask);
router.get('/get-all', taskController.getAllTasks);
router.put('/update/:id', taskController.updateTask);
router.delete('/delete/:id', taskController.deleteTask);
router.patch('/toggle-task-done/:id', taskController.toggleTaskDone);

module.exports = router;