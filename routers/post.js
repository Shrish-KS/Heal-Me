const express= require("express")
const Post = require("../models/post.js")

router=express.Router()

router.get('/',(req,res) => {
    res.send("Hey, This is post route")
})

module.exports = router