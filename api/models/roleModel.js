const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_name: {
        type:String,
        required:true
    },
    value: {
        type:Number,
        required:true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required:false
    }]
}, {timestamps:true});

module.exports = mongoose.model('Role', roleSchema);