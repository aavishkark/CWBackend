const express=require('express')
const { connection } = require('./db')
const { userRouter } = require('./Routes/users.Routes')
const { courseRouter } = require('./Routes/course.Routes')
var cors = require('cors')
const app=express()
app.use(cors())
app.use(express.json())
app.use('/users',userRouter)
app.use('/course',courseRouter)
app.listen(8080,async()=>{
    try{
        await connection
        console.log("Connected to Mongo Atlas")
    }
    catch(err){
        console.log(err)
    }
})