const User = require('../models/User');

const createUser = async(data) => {
    if(!data.name) {throw new Error('This field is required')}
    const checkUser = await User.findOne({name:data.name})
    if(!checkUser) {throw new Error('This name existed')}
    const user = new User(data)
    return user.save()
}

const getAllUsers = async()=>{
    return await User.find()
}

const updateUser = async(id, data) =>{
    if(!data.name) {throw new Error('This field is required')}
    const user = await User.findByIdAndUpdate(id, data)
    if(!user) {throw new Error('User is not found')}
    return user
}

const deleteUser = async(id)=>{
    const user = await User.findByIdAndDelete(id)
    if(!user) {throw new Error('User is not found')}
    return user
}

module.exports = {createUser, getAllUsers, updateUser, deleteUser}