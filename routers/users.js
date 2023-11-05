const express = require('express')
const User = require('../models/users.js')
const Info = require('../models/info.js')
const bcrypt = require("bcrypt")

const router = express.Router()

router.get('/',(req,res) => {
    res.send("Hey, It is user route")
})

router.put('/:id',async(req,res) => {
    if(req.body.UserID === req.params.id || req.user.isAdmin){
        try{
            if(req.body.password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt)
            }
            const user =await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            })
            const info =await Info.findByIdAndUpdate(user.info,{
                $set:req.body
            })
            res.status(200).json({success:true,user,info})
        }
        catch(err){
            console.log(err)
            res.status(400).json({success:false, error:err})
        }
    }
    else{
        res.status(403).json("You can edit only your account")
    }
})


router.delete('/:id',async(req,res) => {
    if(req.body.UserID === req.params.id || req.user.isAdmin){
        try{
            const user=await User.findById(req.params.id)
            await Info.deleteOne(user.info)
            await User.deleteOne(user)

            res.status(200).json({success:true,msg:"Deleted Successfully"})
        }
        catch(err){
            console.log(err)
            res.status(400).json({success:false, error:err})
        }
    }
    else{
        res.status(403).json("You can delete only your account")
    }
})

module.exports = router