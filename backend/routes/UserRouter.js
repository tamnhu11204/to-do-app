const express = require('express')
const router = express.Router()
const userController=require('../controllers/UserController')

router.post('/create', userController.createUser)
router.put('/update', userController.updateUser)
router.get('/get-all', userController.getAllUsers)
router.delete('/delete', userController.deleteUser)