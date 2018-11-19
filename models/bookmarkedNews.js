var mongoose = require('mongoose');
var bookmarkedNewsSchema = new mongoose.Schema({
    username:{
        type:String
    },
    news:{
        type:String
    }
});

var BookmarkedNews = mongoose.model('BookmarkedNews',bookmarkedNewsSchema);
module.exports = BookmarkedNews;