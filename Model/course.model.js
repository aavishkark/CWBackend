const mongoose=require('mongoose')
const courseSchema=mongoose.Schema({
    title:String,
    description:String,
    ratings:Number,
    no_of_students:Number,
    created_by:String,
    language:String,
    price:Number,
    category:String,
    topic:String,
    image:String
})
const courseModel=mongoose.model('educourselist',courseSchema)
module.exports={
    courseModel
}