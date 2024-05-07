const express = require('express');
const mongoose = require('mongoose');
const path = require('path')


const postsRoutes = require('./routes/postsRoutes')
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
app.use("/images",express.static(path.join('backend/images')))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();
});


app.use("/api/posts",postsRoutes)


module.exports = app;