//CRUD Create Read Update Delete

//const mongodb = require('mongodb')
//const MongoClient = mongodb.MongoClient //to give access to functions nessecery for connection to database
//const ObjecID = mongodb.ObjectID

const { MongoClient,ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//const id = new ObjectID()//generate new id
//console.log(id)
//console.log(id.id)
//console.log(id.getTimestamp())

MongoClient.connect(connectionURL,{ useUnifiedTopology: true },(error,client)=>{
    if(error)
        return console.log('Unable to connect to Database')
    //console.log('Connected correctly')
    const db = client.db(databaseName) //this will create if not exist
    
    
    
    /* db.collection('users').updateOne({
        _id:new ObjectID('5e6cf512a98c981978e87e8b')
    },{
        $inc:{
            age: -3 //dec by 3
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    }) */
    /* db.collection('tasks').updateMany({},{
        $set:{
            completed:true
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
 */

    /* db.collection('tasks').deleteOne({
        description:'See friend'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    }) */
    

}) //to be parsed correctly,callback when we are connected to db




