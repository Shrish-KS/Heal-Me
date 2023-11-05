const mongoose = require('mongoose')

const InfoSchema = new mongoose.Schema(
    {
        description:{
            type:String,
            max:100
        },
        city:{
            type:String,
            max:50
        },
        looking_for:{
            type:Array,
            default:[]
        }
    },
    { timestamps:true}
)

module.exports = mongoose.model("info",InfoSchema)