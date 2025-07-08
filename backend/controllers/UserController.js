const userService=require('../services/UserService')

const createUser = async(req, res)=>{
    try{
        const data = req.body
        const user = await userService.createUser(data)
        res.status(201).json(user)
    }catch(error) {
        res.status(400).json({message: error. message})
    }
}

const updateUser = async(req, res)=>{
    try{
        const id = req.params.id
        const data = req.body
        const user = await userService.updateUser(id, data)
        res.status(201).json(user)
    }catch(error) {
        res.status(400).json({message: error.message})
    }
}

const getAllUsers = async (req, res) =>{
    try{ 
        const users =  await userService.getAllUsers()
        res.status(201).json(users)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}

const deleteUser = async(req, res) =>{
    try{
        const id = req.params.id
        const user = await userService.deleteUser(id)
        res.status(201).json(user)
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}

module.exports = {createUser, getAllUsers, updateUser, deleteUser}