let mongoose = require('mongoose');
let adminSchema = new mongoose.Schema({
    name:{
        type:String
    },username:{
        type:String,
        unique:true
    },password:{
        type:String
    },access:{
       type:Number,
    },mobile:{
        type:Number
    },email:{
        type:String,
        unique:true
    }
});

let Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;