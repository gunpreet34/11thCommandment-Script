var mongoose = require('mongoose');
var catSchema = new mongoose.Schema({
    category:{
        type:String,
        unique:true
    },count:{
        type:Number,
        default:0
    },imageURL:{
        type:String
    }
});

var Cat = mongoose.model('Cat',catSchema);
module.exports = Cat;