const mongoose = require('mongoose');


const postShema = mongoose.Schema({
    title:{type:String, require:true},
    content: {type:String,require:true},
    imagePath:{type:String,require:true}
})

module.exports = mongoose.model('Post',postShema) //post is the collection name