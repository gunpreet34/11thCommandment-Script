var express = require('express');
var router = express.Router();

var User = require('./models/user');
var News = require('./models/news');
var BookmarkedNews = require('./models/bookmarkedNews');
var Cat = require('./models/category');

//Register post request
router.post('/register', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var token = req.body.token;
    var newUser = User();
    newUser.username = username;
    newUser.password = password;
    newUser.token = token;
    //Call Mongoose inbuilt save method
    newUser.save(function (err, savedUser) {
        if (err) { 
            try{
                res.send(err);
            }catch(err){
                console.log(err);
            }
        }
        console.log(savedUser);
        res.send("Save success");
    });
});
//Login post request
router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    //Find user with given credentials in the database
    User.findOne({username: username, password: password}, function (err, user) {
        if (err) {
            try {
                console.log(err);
            } catch (err) {
                console.log(err);
            }
        }
        if (!user) {
            res.send("Not found");
        } else {
            console.log(user);
            res.send("Found");
        }
    });
});

//Get Categories
router.get('/getCategories', function (req, res) {
    Cat.find({}, function (err, cats) {
        let data = {success: "0", data: ''};
        if (err) {
            console.log(err);
            res.send(data);
        }
        //console.log(news);
        data.success = "1";
        data.data = cats;
        res.send(data);
        //console.log(data)
    });
});

//Post-news
router.post('/postNews', function (req, res) {

    var newNews = News();
    newNews.title = req.body.title;
    newNews.titleSearch = req.body.title.split(' ').map(k => k.toLowerCase());
    newNews.description = req.body.description;
    newNews.url = req.body.url;
    newNews.category = req.body.category;
    newNews.tagPrimary = req.body.tagPrimary;
    newNews.tagSecondary = req.body.tagSecondary;
    newNews.imageURL = req.body.imageURL;
    newNews.source = req.body.source;
    newNews.date = new Date().getTime() / 1000;
    newNews.tags = req.body.category.split(', ').map(k => k.toLowerCase());

    newNews.tags.forEach((cat) => {
        Cat.findOneAndUpdate({category: req.body.category}, {
            $inc: {
                count:1
            }
        }, {returnOriginal: false}, function (err, category) {
            if (err) {
                try {
                    console.send("Error incrementing category count");
                    return;
                } catch (err) {
                    console.log(err);
                }
            }else {
                if (!category) {
                    console.log("Not found");
                } else {
                    if(cat == ""){
                        console.log("Empty Category. Not adding");
                    }else {
                        let newCat = Cat();
                        if (cat.charAt(cat.length) == ',') {
                            cat = cat.substr(0, cat.length - 2);
                        }
                        newCat.category = cat;

                        newCat.save(function (err, savedCat) {
                            if (err) {
                                try {
                                    console.log(err);
                                } catch (err) {
                                    console.log(err);
                                }
                                console.log(savedCat);
                            }
                        });
                    }
                }
            }
        });
    });

    newNews.save(function (err, savedNews) {
        if (err) {
            try {
                res.send("News with same title already exists");
                console.log(err);
                return;
            } catch (err) {
                console.log(err);
            }
        }
        console.log(savedNews);
        res.send("Save success");
    });
});

//Update news - all fields
router.post('/updateNews', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            title: req.body.title,
            titleSearch: req.body.title.split(' ').map(k => k.toLowerCase()),
            description: req.body.description,
            url: req.body.url,
            category: req.body.category,
            tags:req.body.category.split(', ').map(k => k.toLowerCase()),
            tagPrimary: req.body.tagPrimary,
            tagSecondary: req.body.tagSecondary,
            imageURL: req.body.imageURL,
            source: req.body.source,
            count: req.body.count
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                res.send("Error updating. Title should be unique");
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                req.body.category.split(', ').map(k => k.toLowerCase()).forEach((cat) => {
                    Cat.findOneAndUpdate({category: req.body.category}, {
                        $inc: {
                            count:1
                        }
                    }, {returnOriginal: false}, function (err, category) {
                        if (err) {
                            try {
                                console.send("Error incrementing category count");
                                return;
                            } catch (err) {
                                console.log(err);
                            }
                        }else {
                            if (!category) {
                                console.log("Not found");
                            } else {
                                if(cat == ""){
                                    console.log("Empty Category. Not adding");
                                }else {
                                    let newCat = Cat();
                                    if (cat.charAt(cat.length) == ',') {
                                        cat = cat.substr(0, cat.length - 2);
                                    }
                                    newCat.category = cat;

                                    newCat.save(function (err, savedCat) {
                                        if (err) {
                                            try {
                                                console.log(err);
                                            } catch (err) {
                                                console.log(err);
                                            }
                                            console.log(savedCat);
                                        }
                                    });
                                }
                            }
                        }
                    });
                });
                res.send("Successfully updated");
            }
        }
    });
});

//Update news title
router.post('/updateNewsByTitle', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            title: req.body.title,
            titleSearch: req.body.title.split(' ').map(k => k.toLowerCase())
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                res.send("Error updating. Title should be unique");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});

//Update news description
router.post('/updateNewsByDescription', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            description: req.body.description
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});

//Update news url
router.post('/updateNewsByUrl', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            url: req.body.url
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }
        if (!news) {
            res.send("Not found");
        } else {
            console.log("Successfully updated");
        }
    });
});

//Update news category
router.post('/updateNewsByCategory', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            category: req.body.category,
            tags:req.body.category.split(' ').map(k => k.toLowerCase())
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                req.body.category.split(', ').map(k => k.toLowerCase()).forEach((cat) => {
                    var newCat = Cat();
                    if(cat.charAt(cat.length) == ','){
                        cat = cat.substr(0,cat.length-2);
                    }
                    newCat.category = cat;
                    newCat.save(function (err, savedCat) {
                        if(err){
                            try {
                                console.log(err);
                            }catch(err){
                                console.log(err);
                            }
                            console.log(savedCat);
                        }
                    });
                });
                console.log("Successfully updated");
            }
        }
    });
});

//Update news tagPrimary
router.post('/updateNewsByTagPrimary', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            tagPrimary: req.body.tagPrimary
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});

//Update news tagSecondary
router.post('/updateNewsByTagSecondary', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            tagSecondary: req.body.tagSecondary
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});

//Update news imageUrl
router.post('/updateNewsByImageUrl', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            imageURL: req.body.imageURL
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});

//Update news source
router.post('/updateNewsBySource', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            source: req.body.source
        }
    }, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                console.log("Error updating news");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});

//Updating news time counter
router.post('/updateNewsByCounter', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id},
        {$set: {count: req.body.count}}, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                res.send("Error in connection");
                return;
            } catch (err) {
                console.log(err);
            }
        }else {
            if (!news) {
                res.send("Not found");
            } else {
                console.log("Successfully updated");
            }
        }
    });
});


//Bookmarking
router.post('/bookmark', function (req, res) {

    var bookmarkedNews = BookmarkedNews();
    bookmarkedNews.username = req.body.username;
    console.log("news id= " + req.body.news_id);
    News.findOne({_id:req.body.news_id},function (err, news) {
        if(err){
            console.log(err);
        }else{
            console.log("Found news");
            bookmarkedNews.news = news;
            bookmarkedNews.save(function (err, bookmarkedNews) {
                if (err) {
                    try {
                        console.log(err);
                        res.send("Already bookmarked");
                        return;
                    } catch (err) {
                        console.log(err);
                    }
                }
                res.send("Bookmarked");
            });
        }
    });

});

//Get news bookmarked by user
router.post('/getBookmarkedNews',function (req, res) {
    BookmarkedNews.find({username:req.body.username},{username:0},function (err,bookmarkedNewsArray) {
        var data = {success: "0", data: ''};
        if (err) {
            console.info(err);
            res.send(data)
        } else {
            console.log(bookmarkedNewsArray);
            data.success = "1";
            data.data = bookmarkedNewsArray;
            res.send(data);
        }
    });
});

//Delete bookmark
router.post('/deleteBookmark', function (req, res) {

    News.deleteOne({_id: req.body._id}, function (err, results) {
        if (err) {
            try {
                console.log("Error");
                res.send(err);
                return;
            } catch (err) {
                console.log(err);
            }
        }
        if (results.n > 0) {
            res.send("Successfully deleted");
        } else {
            console.log("Already un bookmarked");
        }

    })
});

//Delete a news
router.post('/deleteNews', function (req, res) {    

    News.deleteOne({_id: req.body._id}, function (err, results) {
        if (err) {
            try {
                console.log("Error");
                res.send(err);
                return;
            } catch (err) {
                console.log(err);
            }
        }
        if (results.n > 0) {
            News.findOne({_id:req.body._id},{title:0,description:0,url:0,category:0,source:0,imageURL:0,tagPrimary:0,tagSecondary:0,titleSearch:0,date:0,count:0},function (err,news) {
                if(err){
                    res.send(data);
                }else{
                    console.log("Found news" + news.tags);
                }
            });
            res.send("Successfully deleted");
        } else {
            res.send("No such record found");
        }

    })
});

//Get all news
router.get('/getNews', function (req, res) {
    News.find({}, function (err, news) {
        var data = {success: "0", data: ''};
        if (err) {
            console.log(err);
            res.send(data);
        }
        //console.log(news);
        data.success = "1";
        data.data = news;
        res.send(data);
        //console.log(data)
    });
});

//Get news by category
router.get('/getNewsByCategory/:category', function (req, res) {
    let callback = (err, newsArray) => {
        var data = {success: "0", data: ''};
        if (err) {
            console.info(err);
            res.send(data)
        } else {
            console.log(newsArray);
            data.success = "1";
            data.data = newsArray;
            res.send(data);
        }
    };
    console.info(req.body.category);

    News.find({tags: req.params.category.toLowerCase()},{category:0}, callback);
    News.find({tags: req.params.category.toLowerCase()},{category:0}, callback);

});

//Search news using title
router.post('/searchNewsByTitle', function (req, res) {
    let callback = (err, newsArray) => {
        var data = {success: "0", data: ''};
        if (err) {
            console.info(err);
            res.send(data)
        } else {
            console.log(newsArray);
            data.success = "1";
            data.data = newsArray;
            res.send(data);
        }
    }
    console.info(req.body.category);

    News.find({titleSearch: {$regex: '^' + req.body.title}},{tags:0,titleSearch:0,url:0,tagPrimary:0,tagSecondary:0,source:0,date:0,count:0,category:0}, callback);

});

//Get news by title
router.post('/getNewsByTitle',function (req,res) {
   News.findOne({title:req.body.title},{titleSearch:0,date:0,count:0},function (err,news) {
       var data = {success: "0", data: ''};
       if(err){
           res.send(data);
       }else{
           console.log(news);
           data.data = news;
           data.success = 1;
           res.send(data);
       }
   });
});

module.exports = router;

