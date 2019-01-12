let mongoose = require('mongoose');
let advSchema = new mongoose.Schema({
    type:{
        type:String
    },advertisementListCount:{
        type:Number,
        default:0
    },title:{
        type:String
    },titleSearch:{
        type:[String],
        default:[]
    },
    description:{
        type:String
    },
    advertisementUrl:{
        type:String
    },URL:{
        type:String
    },source:{
        type:String
    },verify:{
        type:Boolean,
        default:false
    },shown: {
        type:Boolean
    },uniqueUrl:{
        type:String,
        required:true,
        unique:true
    }
}, { strict: false });

let Advertisement = mongoose.model('Advertisement',advSchema);
module.exports = Advertisement;
