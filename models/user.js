var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        index:true
    },
    token:{
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