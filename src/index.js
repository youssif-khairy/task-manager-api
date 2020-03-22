const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

require('./db/mongoose')
const User = require('./models/user') 
const Task = require('./models/task') 

const app = express()
const port = process.env.PORT

//express middleware
/* app.use((req,res,next)=>{
    console.log(req.method, req.path)
    if(req.method == 'GET'){
        res.send('GET request are disabled')
    }else{
        next()//to call next to do (to finish middle ware)
    }
   
}) */

/* app.use((req,res,next)=>{
    res.status(503).send('Server is under mantenance')
})
 */

app.use(express.json())//automatic parse json to object
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('server is up on port ' +port)
})





