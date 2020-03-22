const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        require:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'User'
    }
},{
    timestamps:true
})

const Tasks = mongoose.model('Tasks',taskSchema)

module.exports = Tasks