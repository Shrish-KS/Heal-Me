const express = require('express')
const User = require('../models/users.js')
const bcrypt = require("bcrypt")

const router = express.Router()

router.get('/', (req,res) => {
    res.status(200),send("Welcome to Authorisation Router")
})

router.post('/signup',async(req,res) => {
    try{
        //adding encryption to password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        //create new user
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        // save user
        user.save()
        return res.status(200).json(user)
    }
    catch(err){
        return res.status(409).json({success:false,error:err})
    }
})

router.post('/login', async(req,res) => {
    try{
        const user =await User.findOne({email: req.body.email})
        if(!user){
            return res.status(404).json("User Not Found")
        }
        const valid_pass = await bcrypt.compare(req.body.password, user.password)
        if(!valid_pass){
            return res.status(400).json("Wrong password")
        }

        return res.status(200).json(user)
    }
    catch(err){
        res.status(404).json({success:false,error:err})
    }
})

module.exports = router