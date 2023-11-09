const express= require("express")
const Post = require("../models/post.js")

router=express.Router()

router.get('/',(req,res) => {
    res.send("Hey, This is post route")
})


router.post('/',async(req,res) => {
    const newPost = new Post(req.body);
    try{
        const savedpost = await newPost.save();
        res.status(200).json({success:true , post: savedpost})
    }
    catch(err){
        res.status(500).json({success:false,error:err})
    }
})

router.put('/:id',async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.UserID === req.body.UserID){
            
        }
        else{
            res.status(403).json({ success : false, error:err})
        }
    }
    catch(err){
        return res.status(500).json({success:true , error: err})
    }
})


module.exports = router