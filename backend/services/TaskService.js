const Task = require('../models/Task');
const User = require('../models/User');

const createTask = async(data)=>{
    if(!data.text || !data.deadline || !data.assignedUser)
        throw new Error('All fields are required')
    const user = await User.findOne({name: data.assignedUser})
    if (!user) throw new Error('Assigned user is not found')
    const task = new Task({
        ...data,
        assignedUser: user._id
    })
    return await task.save()
}

const getAllTasks = async()=>{
    return await Task.find().populate('assignedUser', 'name')
}

const updateTask = async(id, data)=>{
    if(!data.text || !data.deadline || !data.assignedUser)
        throw new Error('All fields are required')
    const user = await User.findOne({name: data.assignedUser})
    if(!user) throw new Error('Assigned user is not found')
    const task = await Task.findByIdAndUpdate(id, {
        ...data,
        assignedUser: user._id
    })
    if (!task) throw new Error('Task is not found')
    return task
}

const deleteTask = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    if (!task) throw new Error('Task is not found')
    return task
}

const toggleTaskDone = async (id)=>{
    const task = await Task.findById(id)
    if (!task) throw new Error('Task is not found')
    task.done=!task.done
    return await task.save()
}

module.export = {createTask, getAllTasks, updateTask, deleteTask, toggleTaskDone}