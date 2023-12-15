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
            ref: User
        },
        doctor:{
            type: mongoose.Schema.ObjectId,
            ref: User
        }
    },
    { timestamps:true}
)

module.exports = mongoose.model("appoint",AppointSchema)