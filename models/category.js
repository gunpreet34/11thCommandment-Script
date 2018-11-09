var mongoose = require('mongoose');
var catSchema = new mongoose.Schema({
    category:{
        type:String,
        unique:true
    }
});

var Cat = mongoose.model('Cat',catSchema);
module.exports = Cat;