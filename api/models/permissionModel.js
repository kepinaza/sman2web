const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    permission_name:{
        type: String,
        required: true
    },
    permission_description:{
        type:String,
        required: false
    },
    is_default:{
        type: Number,
        default: 0 //0 = not default, 1 = defult
    }
});

module.exports = mongoose.model('Permission', permissionSchema);