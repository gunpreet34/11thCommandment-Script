let mongoose = require('mongoose');
let pollSchema = new mongoose.Schema({
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
    },shareUrl:{
        type:String
    },type:{
        type:String
    }
});

let Poll = mongoose.model('Poll',pollSchema);
module.exports = Poll;