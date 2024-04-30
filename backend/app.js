const express = require('express');
const mongoose = require('mongoose')
const postModel = require('./models/post')

const app = express();

mongoose.connect('mongodb+srv://akhildasxyz:meanApp%40123@cluster0.2pmi0sl.mongodb.net/meanApp?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log("Connected to Database!");
})
.catch((error)=>{
    console.log("Mongodb Connection error",error);
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader("Access-Control-Methods","GET,POST,PATCH,PUT,DELETE,OPTIONS")
    next()
})


app.post("/api/posts",(req,res)=>{
    const post = new postModel({
        title:req.body.title,
        content: req.body.content
    })
    post.save();
    res.status(201).json({
        message:"Post added successfully",
    })
})

app.get('/api/posts',async(req,res,next)=>{
    const posts = await postModel.find()
    res.status(200).json({
        message:"Post fetched successfully",
        posts:posts
    })
})

module.exports = app;