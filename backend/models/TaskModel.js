const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    text: {type: String, require: true},
    deadline: {type: Date, require: true},
    assignedUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    done: {type: Boolean, default:false}
}, {timestamps: true})

module.exports = mongoose.model('Task', taskSchema)