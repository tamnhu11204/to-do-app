const express = require('express')
const router = express.Router()
const taskController=require('../controllers/TaskController')

router.post('/create', taskController.createTask)
router.get('/get-all', taskController.getAllTasks)
router.put('/update', taskController.updateTask)
router.delete('/delete', taskController.deleteTask)
router.put('toggle-task-done', taskController.toggleTaskDone)