var mongoose = require('mongoose');
var newsSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    url:{
        type:String
    },
    category:{
        type:String
    },
    tagPrimary:{
        type:String
    },
    tagSecondary:{
        type:String
    },
    imageURL:{
        type:String
    },
    source:{
        type:String
    },
    count:{
        type:Number
    },
    date:{
        type:String
    }
});

var News = mongoose.model('News',newsSchema);
module.exports = News;