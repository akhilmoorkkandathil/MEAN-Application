const express = require("express");
const router = express.Router();
const postModel = require('../models/post');
const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const isValide = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValide){
            error = null;
        }
        cb(error,"backend/images");
    },
    filename:(req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext)
    }
})


router.get('',async(req,res,next)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    console.log(pageSize,currentPage);
    let postQuery=postModel.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery=postModel.find()
        .skip(pageSize*(currentPage-1))
        .limit(pageSize)
    }
    postQuery
    .then(async(documents)=>{
        fetchedPosts = documents;
        console.log(fetchedPosts);
        return await postModel.find().count()
    })
    .then(count=>{
        res.status(200).json({
            message:"Post fetched successfully",
            posts:fetchedPosts.map(obj=>{
                return {
                    id:obj._id,
                    title:obj.title,
                    content:obj.content,
                    imagePath:obj.imagePath
                }
            }),
            maxPosts:count

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
            content: obj.content,
            imagePath:obj.imagePath
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

router.post("",multer({storage:storage}).single("image"),(req,res)=>{
    const url = req.protocol + '://'+req.get("host")
    const post = new postModel({
        title:req.body.title,
        content: req.body.content,
        imagePath: url +"/images/" + req.file.filename
    })
    post.save().then(createdPost =>{
        res.status(201).json({
            message:"Post added successfully",
            post:{
                ...createdPost,
                id:createdPost._id,
            }

        })
    })
    
})

router.put(
    "/:id",
    multer({storage:storage}).single("image"),
    async(req,res,next)=>{
        let imagePath = req.body.imagePath;

        if(req.file){
            const url = req.protocol + '://'+req.get("host");
            imagePath = url+"/images/" + req.file.filename
        }
    const postId = req.params.id;
    await postModel.findOneAndUpdate(
        { _id: postId }, 
        { $set: { title: req.body.title, content: req.body.content,imagePath:imagePath } }
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
