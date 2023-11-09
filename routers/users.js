const express = require('express')
const User = require('../models/users.js')
const Info = require('../models/info.js')
const bcrypt = require("bcrypt")

const router = express.Router()

router.get('/',(req,res) => {
    res.send("Hey, It is user route")
})

router.get('/:id',async(req,res) => {
    try{
        const user = await User.findById(req.params.id)
        const info = await Info.find(user.info)
        res.status(200).json({user,info})
    }
    catch(err){
        res.status(400).json({success:false,error:err})
    }
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

router.put('/:id/follow',async (req,res) => {
    if(req.params.id!=req.body.UserID){
        try{
            const user = await User.findById(req.params.id)
            const curuser = await User.findById(req.body.UserID)

            if(!user.followers.includes(req.body.UserID)){
                await user.updateOne({$push :{ followers : req.body.userID }})
                await curuser.updateOne({$push :{ following : req.params.id }})
                req.status(200).json({success:true, message:"Successfully followed user"})
            }
            else{
                res.status(403).json({success: false, message:"User already followed"})
            }
        }
        catch(err){
            res.status(500).json({success: false, error:err})
        }
    }
    else{
        return res.json({success: false, message:"You can't follow yourself"})
    }
})


router.put('/:id/unfollow',async (req,res) => {
    if(req.params.id!=req.body.UserID){
        try{
            const user = await User.findById(req.params.id)
            const curuser = await User.findById(req.body.UserID)

            if(!user.followers.includes(req.body.UserID)){
                await user.updateOne({$pull :{ followers : req.body.userID }})
                await curuser.updateOne({$pull :{ following : req.params.id }})
                req.status(200).json({success:true, message:"Successfully unfollowed user"})
            }
            else{
                res.status(403).json({success: false, message:"User not followed"})
            }
        }
        catch(err){
            res.status(500).json({success: false, error:err})
        }
    }
    else{
        return res.json({success: false, message:"You can't unfollow yourself"})
    }
})

module.exports = router