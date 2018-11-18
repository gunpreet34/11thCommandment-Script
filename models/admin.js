let mongoose = require('mongoose');
let adminSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },password:{
        type:String
    }
});

let Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;
