const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require :true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        minlength:7,
        trim:true,
        validate(value){
            if(/password/.test(value.toLowerCase())){
                throw new Error('Password field shouldn\'t contain password word')
            }
        }
    },
    email:{
        type :String,
        require: true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if (value < 0){
                throw new Error('Age must be positive number')
            }
        }
    },
    tokens: [{
        token:{
            type:String,
            require:true //the object required not the array
        }
    }],
    avatar:{
        type: Buffer //for images storage
    }
},{
    timestamps:true
})

userSchema.virtual('usertasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'userid'
})

//methods for single user
//statics for 'U'ser

//for hiding password and tokens array
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject

}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
//statics as override
userSchema.statics.findByCredintials = async (email,password)=>{
    const user = await User.findOne({email})
    console.log('User is ',user)
    if(!user) throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) throw new Error('Unable to login')
    return user
}

//hash plain text password before save
userSchema.pre('save',async function(next){ // middle ware for do something pre user save
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()//to finish this function and save
})
//delete user tasks when user is delete
userSchema.pre('remove',async(next)=>{
    const user = this
    Task.deleteMany({ userid: user._id})
    next()
})

const User = mongoose.model('User',userSchema)


module.exports = User