const express = require('express')
const auth = require('../middleware/auth') 
const User = require('../models/user') 
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail , sendCancelationEmail} = require('../emails/account')


const router = new express.Router()

router.post('/users',async (req,res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user , token})
    }catch(e){
        res.status(400).send(e)
    }
   
})

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredintials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send({error:e})
    }


})
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(t => t.token != req.token)
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth,async(req,res) => {

    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)
    
})

router.patch('/users/me',auth,async(req,res)=>{
    const _id = req.user._id
    const allowUpdate = ['name','email','password','age']
    const update = Object.keys(req.body)
    const is_valid_operation = update.every(el => allowUpdate.includes(el))
    if(!is_valid_operation) { return res.status(400).send({error:'Invalid opertion'})}
    try{
        
        update.forEach(el => req.user[el] = req.body[el])
        await req.user.save()
        /* const user = await User.findByIdAndUpdate(_id,req.body,
            {
                new:true,
                runValidators:true
            }) */
        
        res.send(req.user)
    }catch(e){
        res.status(400).send({})
    }
})

router.delete('/users/me',auth,async(req,res)=>{

    try{
        /* const user = await User.findByIdAndDelete(req.user._id)
        if(!user) return res.status(404).send() */
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
   // dest:'avatar',
    limits:{
        fileSize: 1000000 //in Bytes so it means 1MB
    },
    fieldFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload a jpg or jpeg or png'))
        }
        callback(undefined,true)
    }
})
router.post('/users/me/avatar', auth,upload.single('avatar'),async (req,res)=>{ //register in multer middleware to enable it, avatar is body key
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer // sava image
    await req.user.save()
    res.send()
},(error,req,res,next)=>{//handling error comming from multer so that we can return back json data and error message we throw above
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//GET image frrom api to browser screen
router.get('/users/:id/avatar',async(req,res)=>{

    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')//set header for response
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router