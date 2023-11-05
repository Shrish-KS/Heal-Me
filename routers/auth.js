const express = require('express')
const User = require('../models/users.js')
const bcrypt = require("bcrypt")

const router = express.Router()

router.post('/register',async(req,res) => {
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        user.save()
        return res.status(200).json(user)
    }
    catch(err){
        return res.status(409).json({success:false,error:err})
    }

    return res.send("Hey, It is auth route")
})

module.exports = router