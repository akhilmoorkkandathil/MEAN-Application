const express = require("express");
const router = express.Router();
const postModel = require('../models/post');


router.post("",(req,res)=>{
    const post = new postModel({
        title:req.body.title,
        content: req.body.content
    })
    post.save().then(createdPost =>{
        res.status(201).json({
            message:"Post added successfully",
            postId:createdPost._id
        })
    })
    
})
router.get('',async(req,res,next)=>{
    const posts = await postModel.find()
    res.status(200).json({
        message:"Post fetched successfully",
        posts:posts.map(obj=>{
            return {
                id:obj._id,
                title:obj.title,
                content:obj.content
            }
        })
    })
})

router.get('/:id',async(req,res,next)=>{
    const postId = req.params.id;
    const posts = await postModel.find({ _id:postId });
    const obj = posts.map((obj) => {
        return {
            id: obj._id,
            title: obj.title,
            content: obj.content
        };
    });
    if (posts) {
        res.status(200).json({
            message:"Post fetched successfully",
            posts: obj[0]
            })
    }else{
        return res.status(404).json({ message: "Post not found!!!" }); 
    }
    
})

router.put("/:id",async(req,res,next)=>{
    const postId = req.params.id;
    await postModel.findOneAndUpdate(
        { _id: postId }, 
        { $set: { title: req.body.title, content: req.body.content } }
      );
    res.status(200).json({ message: "Post update successfully" });
})

router.delete("/:id",async(req,res,next)=>{
    const postId = req.params.id;
    const result = await postModel.deleteOne({ _id:postId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("Deleted post:", result);
    res.status(200).json({ message: "Post deleted successfully" })
})

module.exports = router;
