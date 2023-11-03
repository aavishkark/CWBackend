const express=require('express')
const courseRouter=express.Router()
const { courseModel } = require('../Model/course.model')
const { auth } = require('../Middleware/auth.middleware')

courseRouter.post('/create',auth,async(req,res)=>{
   const data=req.body
   try{
    const doc=new courseModel(data)
    await doc.save()
    res.status(200).send({"msg":"Course Saved Successfully"})
    
   }
   catch(err){
    res.status(401).send({"Server Error":err}) 
   }
})

courseRouter.patch('/updateCourse/:courseid',async(req,res)=>{
    const id=req.params.courseid
    try{
      await courseModel.findByIdAndUpdate({_id:id},req.body)
      res.status(200).send({"msg":`The Course with id- ${id} has been updated successfully`,"update":req.body})
    }
    catch(err){
      res.status(400).send({"err":err})
    }
 })

 module.exports={
    courseRouter
 }