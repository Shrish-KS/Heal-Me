const mongoose = require('mongoose')
const User = require('./users.js')

const AppointSchema = new mongoose.Schema(
    {
        date:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
        },
        patient:{
            type: mongoose.Schema.ObjectId,
            ref: Users
        },
        doctor:{
            type: mongoose.Schema.ObjectId,
            ref: Users
        }
    },
    { timestamps:true}
)

module.exports = mongoose.model("appoint",AppointSchema)