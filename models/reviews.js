let mongoose=require('mongoose');

let Schema=mongoose.Schema;

let reviesSchema=new Schema({
    comment:{
        type:String,
        required: true
    },
    rating:{
        type:Number,
        required: true,
        max:5,
        min:1
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
    ,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("Review",reviesSchema);