const express = require('express')
const router = express.Router()
const userController=require('../controllers/UserController')

router.post('/create', userController.createUser)
router.put('/update/:id', userController.updateUser)
router.get('/get-all', userController.getAllUsers)
router.delete('/delete/:id', userController.deleteUser)

module.exports = router