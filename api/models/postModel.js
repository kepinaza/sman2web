const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categories:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:false
    }]
}, {timestamps:true});

module.exports = mongoose.model('Post', postSchema);