const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    role:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: 0
    }]
}, {timestamps:true});

module.exports = mongoose.model('User', userSchema);