const express=require('express')
const userRouter=express.Router()
const bcrypt=require('bcrypt')
const { userModel } = require('../Model/users.model')
const { tokenModel } = require('../Model/token.model')
const jwt=require('jsonwebtoken')
const { auth } = require('../Middleware/auth.middleware')
const { courseModel } = require('../Model/course.model')

userRouter.post('/register',async(req,res)=>{
    const {username,email,password,city,age,gender}=req.body
    try{
        bcrypt.hash(password, 5,async(err, hash)=> {
          if(err){
            res.status(200).send({"msg":"Not able to generate hash","err":err})
          }
          else{
            const user=new userModel({
                username,
                email,
                password:hash,
                city,
                age,
                gender,
                cart:[],
                wishlist:[],
                active_orders:[],
                past_orders:[]
            })
            await user.save()
            res.status(200).send({"msg":"The new use is registered scuccessfully","new_user":req.body})
          }
        });
    }
    catch(err){
           res.status(400).send({"err":err})
    }
})


userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await userModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, async(err, result)=> {
                if(result){
                    const token=jwt.sign({email:email},"masai")
                    //const newtoken=new tokenModel({token,email})
                   // await newtoken.save()
                    res.status(200).send({"msg":"Login Successfull","token":token})
                }
                else{
                    res.status(200).send({"msg":"Wrong credentials","err":err})
                }
            });
            
        }
        else{
            res.status(200).send({"msg":"User Does not exist"})  
        }
    }
    catch(err){
        res.status(400).send({"err":err})
    }
})

userRouter.post('/logout',auth,async(req,res)=>{
    const token=req.headers.token?.split(" ")[1]
    try{
      const tokendata=new tokenModel({token})
      await tokendata.save()
      res.status(200).send({"msg":"You have been logged out"})
    }
    catch(err){
        res.status(400).send({"err":err})
    }
})

userRouter.get('/courses',auth,async(req,res)=>{
    try{
        const courses=await courseModel.find()
        res.status(200).send({"courses":courses})
    }
    catch(err){
        res.status(401).send({"Server Error":err}) 
    }
})

userRouter.post('/addtocart/:courseid',auth,async(req,res)=>{
    const id=req.params.courseid
    const useremail=req.body.email
    try{
      const finduser= await userModel.findOne({email:useremail})
      const findcourse=await courseModel.findOne({_id:id})
            const newcart=finduser.cart
            newcart.push(id)
            await userModel.findByIdAndUpdate(finduser._id,{cart:newcart})
            res.status(200).send({"msg":"Course added Successfully to Cart"})
    }
    catch(err){
        res.status(401).send({"Server Error":err}) 
    }
})

userRouter.post('/removefromcart/:courseid',auth,async(req,res)=>{
    const id=req.params.courseid
    const useremail=req.body.email
    try{
      const finduser= await userModel.findOne({email:useremail})
      const findcourse=await courseModel.findOne({_id:id})
            const newcart=finduser.cart
            newcart.push(id)
            await userModel.findByIdAndUpdate(finduser._id,{$pull:{cart:id}})
            res.status(200).send({"msg":"Course removed Successfully from Cart"})
    }
    catch(err){
        res.status(401).send({"Server Error":err}) 
    }
})

// userRouter.get('/courses/:q',auth,async(req,res)=>{
//     const query=req.params.q
//     try{
//        const find=await courseModel.find({$text:{$search:query}})
//        if(find==null){
//         res.status(200).send({"msg":"No Result Found"})
//        }
//        else{
//         res.status(200).send({"courses":find})
//        } 
//     }
//     catch(err){
//         res.status(401).send({"Server Error":err}) 
//     }
// })



module.exports={
    userRouter
}