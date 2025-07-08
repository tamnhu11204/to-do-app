const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    text: {type: String, required: true},
    deadline: {type: Date, required: true},
    assignedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    done: {type: Boolean, default:false}
}, {timestamps: true})

module.exports = mongoose.model('Task', taskSchema)