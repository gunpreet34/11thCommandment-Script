var mongoose = require('mongoose');
var newsSchema = new mongoose.Schema({
    title:{
        type:String
    },
    titleSearch:{
        type:[String],
        default: []
    }
    ,
    description:{
        type:String
    },
    url:{
        type:String
    },
    tags:{
        type: [String],
        default : []
    },
    category:{
        type:String
    },
    imageURL:{
        type:String
    },
    source:{
        type:String
    },
    count:{
        type:Number,
        default:0
    },
    date:{
        type:String
    },
    verify:{
        type:Boolean,
        default:false
    },uniqueUrl:{
        type:String,
        required:true
    }
});

var News = mongoose.model('News',newsSchema);
module.exports = News;