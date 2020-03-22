const express = require('express')

const Task = require('../models/task') 
const auth = require('../middleware/auth')

const router = new express.Router()



router.post('/tasks',auth,async(req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        userid:req.user._id
    })
    try{
    await task.save()
    res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
// GET /tasks?completed=(false | true)
//for pagination enabling ---> use --> limit skip
// GET /tasks?limit=10&skip=3
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    const match = {} //name should be match
    const sort = {} // name should be sort
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
    //const tasks = await Task.find({userid:req.user._id})
    await req.user.populate({
        path:'usertasks',
        match,
        options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort //createdAt is field name in db -- desc = -1 , asc = 1
        }
    }).execPopulate() // get all tasks created by this user using virtual
    res.send(req.user.usertasks)
    }catch(e){
        res.status(500).send()
    }
})
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id,userid:req.user._id })
        if(!task)  res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const keys = Object.keys(req.body)
    const valid_keys = ['description','completed']
    const is_valid = keys.every(el=> valid_keys.includes(el))
    if (!is_valid) return res.status(400).send({error:'Invalid data'})

    try{
        const task = await Task.findOne({_id,userid:req.user._id})
        //const task = await Task.findById(_id)
        
        /* const task = await Task.findByIdAndUpdate(_id,req.body,{
            new:true,
            runValidators:true
        }) */
        if(!task) return res.status(404).send()
        keys.forEach(el=>task[el] = req.body[el])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{

    try{
        const task = await User.findOneAndDelete({_id:req.params.id,userid:req.user._id})
        if(!task) return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})




module.exports = router