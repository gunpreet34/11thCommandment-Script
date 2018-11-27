let mongoose = require('mongoose');
let catSchema = new mongoose.Schema({
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

let Cat = mongoose.model('Cat',catSchema);
module.exports = Cat;