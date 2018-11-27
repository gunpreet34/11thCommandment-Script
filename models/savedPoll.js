let mongoose = require('mongoose');
let savedPollSchema = new mongoose.Schema({
    username:{
        type:String
    },poll_id:{
        type:String
    }
});

let SavedPoll = mongoose.model('SavedPoll',savedPollSchema);
module.exports = SavedPoll;