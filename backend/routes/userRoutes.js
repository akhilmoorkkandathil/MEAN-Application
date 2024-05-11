const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userModel = require('../models/user')

router.post("/signup",async(req,res,next)=>{
    let bcryptPassword = await bcrypt.hash(req.body.password,10);
    const user = new userModel({
        username:req.body.username,
        email: req.body.email,
        password:bcryptPassword
    })
    user.save()
    .then((result)=>{
        if(!result){
            return res.status(201).json({
                message:"User Created failed",
            })
        }
        const token = jwt.sign(
            {email:user.email,userId:user._id},
            'secret_password',
            {expiresIn:'1h'}
        );  // creating token 
        return res.status(200).json({
            token:token
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

router.post("/login",async(req,res,next)=>{

    let user = await userModel.findOne({email:req.body.email})
    
    if(!user){
        return res.status(401).json({
            message:"Auth failed"
        })
    }
    let checkPassword = bcrypt.compare(req.body.password,user.password);

    if(!checkPassword){
        return res.status(401).json({
            message:"Password incorrect"
        })
    }
    const token = jwt.sign(
        {email:user.email,userId:user._id},
        'secret_password',
        {expiresIn:'1h'}
    );  // creating token 
    return res.status(200).json({
        token:token
    })
    
})



module.exports = router;