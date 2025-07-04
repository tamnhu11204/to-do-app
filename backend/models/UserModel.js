const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name: {type: String, require: true, unique: true},
}, {timestamps: true})

module.export = mongoose.model('User', userSchema)