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


router.get('/:id',async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post){
            return res.status(200).json({success:true,post: post})
        }
        else{
            return res.status(404).json({success:false, message:"Post not found"})
        }
    }
    catch(err){
        res.status(500).json({success:false, error:err})
    }
})




router.put('/:id',async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.UserID === req.body.UserID){
            await post.updateOne({$set:req.body})
            return res.status(300).json({success:true, post:post})
        }
        else{
            res.status(403).json({ success : false, message: "You can update only your post"})
        }
    }
    catch(err){
        return res.status(500).json({success:true , error: err})
    }
})

router.delete('/:id',async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.UserID === req.body.UserID){
            await post.deleteOne()
            return res.status(200).json({success:true, post:post})
        }
        else{
            res.status(403).json({ success : false, message:"You can delete only your post"})
        }
    }
    catch(err){
        return res.status(500).json({success:true , error: err})
    }
})


router.put('/:id/like', async(req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.UserID)){
            await post.updateOne({$push: {likes: req.body.UserID}})
            res.status(200).json({success:true, message:"Post is liked"})
        }
        else{
            await post.updateOne({$pull: {likes: req.body.UserID}})
            res.status(200).json({success:true, message:"Post is disliked"})
        }
    }
    catch(err){
        res.status(500).json({success:false,error:err})
    }
})


router.get('/timeline', async(req,res) => {
    try{
        const curuser = await User.findById(req.body.UserID)
        const userposts = await Post.find({UserID: req.body.UserID})
        const friendposts = await  Promise.all(
            curuser.followings.map((friendID) => {
                Post.find({UserID:friendID})
            })
        )
        res.status(200).json({success:true, posts: userposts.concat(...friendposts)})
    }
    catch(err){
        return res.status(500).json({success:false,error: err})
    }
})


module.exports = router