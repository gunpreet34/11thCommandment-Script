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
    optionOneCount:{
        type:Number,
        default:0
    },
    optionTwoCount:{
        type:Number,
        default:0
    },
    optionOne:{
        type:String
    },
    optionTwo:{
        type:String
    },
    date:{
        type:String
    }
});

var Poll = mongoose.model('Poll',pollSchema);
module.exports = Poll;