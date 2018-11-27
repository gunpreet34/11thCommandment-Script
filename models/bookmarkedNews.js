var mongoose = require('mongoose');
var bookmarkedNewsSchema = new mongoose.Schema({
    username:{
        type:String
    },
    news_id:{
      type:String
    },
    news:{
        type:Object
    }
});

var BookmarkedNews = mongoose.model('BookmarkedNews',bookmarkedNewsSchema);
module.exports = BookmarkedNews;