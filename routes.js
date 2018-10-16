var express = require('express');
var router = express.Router();

var User = require('./models/user');
var News = require('./models/news');

//Register post request
router.post('/register', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var newUser = User();
    newUser.username = username;
    newUser.password = password;

    //Call Mongoose inbuilt save method
    newUser.save(function (err, savedUser) {
        if (err) {
            throw err;
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

//Post-news post request
router.post('/postNews', function (req, res) {

    var newNews = News();
    newNews.title = req.body.title;
    newNews.description = req.body.description;
    newNews.url = req.body.url;
    newNews.category = req.body.category;
    newNews.tagPrimary = req.body.tagPrimary;
    newNews.tagSecondary = req.body.tagSecondary;
    newNews.imageURL = req.body.imageURL;
    newNews.source = req.body.source;
    newNews.date = new Date().getTime() / 1000;
    newNews.count = 0;
    newNews.tags = req.body.category.split(',').map(k => k.toLowerCase());
    newNews.save(function (err, savedNews) {
        if (err) {
            try {
                res.send("News with same title already exists");
                return;
            } catch (err) {
                console.log(err);
            }
        }
        console.log(savedNews);
        res.send("Save success");
    });
});

router.post('/updateNews', function (req, res) {

    News.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            category: req.body.category,
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
//Maintaining counter for Top Stories
router.post('/increaseNewsCounter', function (req, res) {

    News.findOneAndUpdate({title: req.body.title}, {$set: {count: req.body.count}}, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                res.send("Error in connection");
                return;
            } catch (err) {
                console.log(err);
            }
        }
        if (!news) {
            res.send("Not found");
        } else {
            console.log("Successfully updated")
        }
    });
});
//Bookmarking
router.post('/increaseNewsCounter', function (req, res) {

    News.findOneAndUpdate({title: req.body.title}, {$set: {count: req.body.count}}, {returnOriginal: false}, function (err, news) {
        if (err) {
            try {
                res.send("Error in connection");
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
        console.log(news);
        data.success = "1";
        data.data = news;
        res.send(data);
        //console.log(data)
    });
});

router.post('/getNewsByCategory', function (req, res) {
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

    News.find({tags: req.body.category},{category:0}, callback);

});


module.exports = router;

