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

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (!data.text || !data.deadline || !data.assignedUser) {
      return res.status(400).json({ message: 'All fields (text, deadline, assignedUser) are required' });
    }
    const task = await taskService.updateTask(id, data);
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskService.deleteTask(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const toggleTaskDone = async (req, res) => {
    console.log('Toggle task called with id:', req.params.id);
    try {
        const id = req.params.id;
        const task = await taskService.toggleTaskDone(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {createTask, getAllTasks, updateTask, deleteTask, toggleTaskDone}