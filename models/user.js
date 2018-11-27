let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        index:true
    },
    fb_id:{
        type:String,
    },fb_number:{
        type:Number,
    },
    gmail_id:{
        type:String,
    },gmail_number:{
        type:Number,
    },
    mobile:{
        type:String,
        unique:true
    },
    name:{
        type:String
    },
    bookmarkedNews:{
        type:Array
    }
});

let User = mongoose.model('User',userSchema);
module.exports = User;