const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    city:String,
    age:Number,
    gender:String,
    cart:[String],
    wishlist:[String],
    active_orders:[String],
    past_orders:[String]
})
const userModel=mongoose.model('eduuser',userSchema)
module.exports={
    userModel
}