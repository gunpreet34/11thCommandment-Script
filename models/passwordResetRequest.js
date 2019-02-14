let mongoose = require('mongoose');
let passwordResetRequestSchema = new mongoose.Schema({
        time: {
            type: Number
        }, user_id: {
            type: String
        },otp:{
            type: Number
    }
    });

let PasswordResetRequest = mongoose.model('PasswordResetRequest',passwordResetRequestSchema);
module.exports = PasswordResetRequest;
