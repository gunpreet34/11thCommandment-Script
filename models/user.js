var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        index:true
    },access:{
        type:Number
    },
    fb_token:{
        type:String,
        unique:true
    },
    gmail_token:{
        type:String,
        unique:true
    },
    mobile:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    name:{
        type:String
    },
    categories:{
        type:Array
    },
    bookmarkedNews:{
        type:Array
    }
});

var User = mongoose.model('User',userSchema);
module.exports = User;