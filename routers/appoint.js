const express= require("express")
const Appoint = require("../models/appoint.js")
const User = require('../models/users.js')

router=express.Router()

router.get('/',(req,res) => {
    res.status(200).send("Hey, This is appointment router")
})

router.post('/:id',async(req,res) => {
    const newappoint = new Appoint(req.body);
    try{
        const user = await User.findById(req.body.UserID)
        const doctor = await User.findById(req.params.id)
        if(user.id != doctor.id){
            const savedappoint= await newappoint.save()
            user.updateOne({$push: {Appoinments: savedappoint}})
            doctor.updateOne({$push: {Appoinments: savedappoint}})
            res.status(200).json({success:true, appointment: savedappoint})
        }
        else{
            res.status(403).json({success:false, message: "You can't make appointment with yourself"})
        }
    }
    catch(err){
        return res.status(500).json({success:false,error:err})
    }
})


router.delete('/:id',async(req,res) => {
    try{
        const appoint= await Appoint.findById(req.params.id)
        const patient= await User.findById(appoint.patient)
        const doctor = await User.findById(appoint.doctor)

        await patient.updateOne({$pull: {Appoinments: appoint}})
        await doctor.updateOne({$pull: {Appoinments: appoint}})
        res.status(200).json({success:true,message:"Appointment deleted successfully"})
    }
    catch(err){
        return res.status(500).json({success:false,error:err})
    }
})


router.get('/:id',async(req,res) => {
    try{
        const user= User.findById(req.params.id)
        const appointments= user.Appoinments
        return res.status(200).json({success:true , Appoinments:appointments})
    }
    catch(err){
        res.status(500).json({success:false , error:err})
    }
})

module.exports = router