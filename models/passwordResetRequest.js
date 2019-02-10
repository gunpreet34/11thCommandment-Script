let mongoose = require('mongoose');
let passwordResetRequestSchema = new mongoose.Schema({
        time: {
            type: Number
        }, user_id: {
            type: String
        }
    });

let PasswordResetRequest = mongoose.model('PasswordResetRequest',passwordResetRequestSchema);
module.exports = PasswordResetRequest;
