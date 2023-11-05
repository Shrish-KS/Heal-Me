const express = require('express')
const User = require('../models/users.js')

const router = express.Router()

router.post('/register',async(req,res) => {
    const user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try{
        user.save()
        res.status(200).json(user)
    }
    catch(err){
        res.status(409).json({success:false,error:err})
    }

    res.send("Hey, It is auth route")
})

module.exports = router