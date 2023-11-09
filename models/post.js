const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
    {
        UserID:{
            type:String,
            required:true
        },
        desc:{
            type:String,
            max:500
        },
        img:{
            type:String
        },
        likes:{
            type:Array,
            default:[]
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model("post",PostSchema)