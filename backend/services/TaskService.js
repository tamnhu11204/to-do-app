const Task = require('../models/TaskModel');
const User = require('../models/UserModel');

const createTask = async (data) => {
  if (!data.text || !data.deadline || !data.assignedUser) {
    throw new Error('All fields are required');
  }
  const user = await User.findById(data.assignedUser);
  if (!user) throw new Error('Assigned user is not found');
  const task = new Task({
    ...data,
    assignedUser: user._id
  });
  return await task.save();
};

const getAllTasks = async () => {
  return await Task.find().populate('assignedUser', 'name');
};

const updateTask = async (id, data) => {
  if (!data.text || !data.deadline || !data.assignedUser) {
    throw new Error('All fields (text, deadline, assignedUser) are required');
  }
  const user = await User.findById(data.assignedUser);
  if (!user) throw new Error('Assigned user is not found');
  const task = await Task.findByIdAndUpdate(id, {
    ...data,
    assignedUser: user._id
  }, { new: true, runValidators: true });
  if (!task) throw new Error('Task not found');
  return task;
};

const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw new Error('Task not found');
  return task;
};

const toggleTaskDone = async (id) => {
  const task = await Task.findById(id);
  if (!task) throw new Error('Task not found');
  task.done = !task.done;
  return await task.save();
};

module.exports = { createTask, getAllTasks, updateTask, deleteTask, toggleTaskDone };