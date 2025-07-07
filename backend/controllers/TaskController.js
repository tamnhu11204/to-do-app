const taskService=require('../services/TaskService')

const createTask = async(req, res)=>{
    try {
        const data = req.body;
        const task = await taskService.createTask(data)
        res.status(201).json(task);
    }catch(error) {
        res.status(400).json({message: error.message})
    }
}

const getAllTasks = async(req, res)=>{
    try {
        const tasks = await taskService.getAllTasks()
        res.status(201).json(tasks)
    }catch(error) {
        res.status(400).json({message:error.message})
    }
}

const updateTask = async(req, res) => {
    try {
        const id = req.param
        const data = req.body
        const task = await taskService.updateTask(id, data)
        res.status(201).json(task)
    }catch(error) {
        res.status(400).json({message: error.message})
    }
}

const deleteTask = async(req, res) => {
    try {
        const id = req.param
        const task = await taskService.deleteTask(id)
        res.status(201).json(task)
    } catch(error) {
        res.status(400).json({message:error.message})
    }
}

const toggleTaskDone = async(req, res) =>{
    try {
        const id = req.param
        const task = await taskService.toggleTaskDone(id)
        res.status(201).json(task)
    } catch(error) {
        res.status(400).json({message:error.message})
    }
}

module.exports = {createTask, getAllTasks, updateTask, deleteTask, toggleTaskDone}