var mongoose = require('mongoose');
var pollSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    url:{
        type:String
    },imageURL:{
        type:String
    },
    question:{
        type:String
    },
    agreeCount:{
        type:Number,
        default:0
    },
    disagreeCount:{
        type:Number,
        default:0
    },
    date:{
        type:String
    }
});

var Poll = mongoose.model('Poll',pollSchema);
module.exports = Poll;