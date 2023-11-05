const express = require('express')
const User = require('../models/users.js')
const Info = require('../models/info.js')
const bcrypt = require("bcrypt")

const router = express.Router()

router.get('/', (req,res) => {
    console.log(req.body.UserId)
    res.status(200).send("Welcome to Authorisation Router")
})

router.post('/signup',async(req,res) => {
    try{
        //adding encryption to password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //create info
        const description = req.body.description
        const city = req.body.city
        var looking_for = req.body.looking_for
        if(!looking_for){
            looking_for=[]
        }
        const info = await new Info({
            description:description,
            city:city,
            looking_for:looking_for
        })

        info.save()
        
        //create new user
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            info: info
        })

        // save user
        user.save()
        return res.status(200).json(user)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,error:err})
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
        res.status(500).json({success:false,error:err})
    }
})

module.exports = router