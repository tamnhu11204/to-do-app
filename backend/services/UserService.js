const User = require('../models/UserModel');

const createUser = async (data) => {
  if (!data.name) throw new Error('Name is required');
  const checkUser = await User.findOne({ name: data.name });
  if (checkUser) throw new Error('This name already exists');
  const user = new User(data);
  return await user.save();
};

const getAllUsers = async () => {
  return await User.find();
};

const updateUser = async (id, data) => {
  if (!data.name) throw new Error('Name is required');
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  if (!user) throw new Error('User is not found');
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User is not found');
  return user;
};

module.exports = { createUser, getAllUsers, updateUser, deleteUser };