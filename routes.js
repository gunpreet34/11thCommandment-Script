let express = require('express');
let router = express.Router();
let sortJson = require('sort-json-array');
let fs = require('fs');

let User = require('./models/user');
let News = require('./models/news');
let BookmarkedNews = require('./models/bookmarkedNews');
let Cat = require('./models/category');
let Poll = require('./models/poll');
let SavedPoll = require('./models/savedPoll');
let Admin = require('./models/admin');


//Admin registration page renderer
router.get('/registerAdmin', function(req, res){
    res.render('adminRegister.ejs');
});

//Admin registration post request handler
router.post('/registerSuccess',function (req, res) {
    let data = {success:"0",data:""};
    try{
        let admin = Admin();
        admin.name = req.body.name;
        admin.email = req.body.email;
        admin.access = req.body.access;
        admin.password = req.body.password;
        admin.number = req.body.number;
        if(admin.password == req.body.repeatedPassword){
            admin.save(function (err, savedAdmin) {
                if(err){
                    data.data = err;
                }else{
                    data.success = "1";
                    data.data = savedAdmin.data;
                }
                res.send(data);
            });
        }else{
            data.data = "Passwords do not match";
            res.send(data);
        }
    }catch(err){
        data.data = "Error in /registerSuccess: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Admin login post request handler
router.post('/adminLogin',function (req, res) {
    let data = {success:0,data:""};
    try{
        let email = req.body.email;
        let password = req.body.password;
        Admin.findOne({email:email,password:password},function (err, admin) {
            if(err){
                data.data = err;
            }else{
                data.success="1";
                data.data = admin._id;
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /adminLogin: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Normal user register post request
router.post('/register', function (req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let token = req.body.token;
        let newUser = User();
        newUser.username = username;
        newUser.password = password;
        newUser.token = token;
        //Call Mongoose inbuilt save method
        newUser.save(function (err, savedUser) {
            if (err) {
                try {
                    res.send(err);
                } catch (err) {
                    console.log(err);
                }
            }
            console.log(savedUser);
            res.send("Save success");
        });
    }catch(err){
        data.data = "Error in /register: " + err;
        console.log(data.data);
        res.send(data)
    }
});
//Normal user login post request
router.post('/login', function (req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;

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
    }catch(err){
        let data = "Error in /login: " + err;
        console.log(data);
        res.send(data)
    }
});

//Add a new Category post request
router.post('/addCategory', function (req, res) {
    try {
        let cat = Cat();
        cat.category = req.body.category;
        let image = req.body.image;
        let data = image.replace(/^data:image\/\w+;base64,/, "");
        let buffer = new Buffer(data, 'base64');
        fs.writeFile(cat.category, buffer);
        cat.save({category: req.body.category}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send("Category added");
            }
        });
    }catch(err){
        let data = "Error in /addCategory: " + err;
        console.log(data);
        res.send(data)
    }

});

//Get Categories
router.get('/getCategories', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Cat.find({}, function (err, cats) {
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
    }catch(err){
        data.data = "Error in /getCategories: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get only categories which have news
router.get('/getCategoriesWithNews', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Cat.find({count: {$gt: 0}}, function (err, cats) {
            if (err) {
                console.log(err);
                res.send(data);
            } else {
                console.log(cats);
                data.success = "1";
                data.data = cats;
                res.send(data);

            }
        });
    }catch(err){
        data.data = "Error in /getCategoriesWithNews: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Adding poll post request
/*
router.post('/addPoll', function (req, res) {
    let user_id = req.body.user_id;
    let user_access = 0;
    Admin.findOne({_id:user_id},function (err, adminUser) {
        if(err){
            console.log("Error while finding user: " +err);
        }else{
            user_access = adminUser.access;
            let poll = Poll();
            if(user_access){
                poll.verify = true;
            }else {
                poll.verify = false;
            }
            poll.title = req.body.title;
            poll.description = req.body.description;
            poll.url = req.body.url;
            poll.imageURL = req.body.imageURL;
            poll.question = req.body.question;
            poll.optionOne = req.body.optionOne;
            poll.optionTwo = req.body.optionTwo;
            poll.optionOneCount = 0;
            poll.optionTwoCount = 0;
            poll.date = new Date().getTime() / 1000;
            poll.type = "Poll";
            poll.shareUrl = poll.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
            poll.shareUrl += "_";
            let date = poll.date.split('.');
            poll.shareUrl += date[0];
            poll.save(function (err, savedPoll) {
                if (err) {
                    try {
                        console.log(err);
                        res.send("Already added poll");
                    } catch (err) {
                        res.send(err);
                    }
                }else{
                    console.log(savedPoll);
                    res.send("Save success");
                }
            });
        }
    });


});
*/

//Update Poll post request
/*
router.post('/updatePoll', function (req, res) {
    let user_id = req.body.user_id;
    let user_access = 0;
    Admin.findOne({_id:user_id},function (err, adminUser) {
        if(err){
            console.log("Error while finding user: " +err);
        }else{
            user_access = adminUser.access;
            let set;
            if(user_access){
                set = {title: req.body.title,description: req.body.description,url: req.body.url,imageURL: req.body.imageURL,question: req.body.question,optionOne:req.body.optionOne,optionTwo:req.body.optionTwo,verify:true};
            }else {
                set = {title: req.body.title,description: req.body.description,url: req.body.url,imageURL: req.body.imageURL,question: req.body.question,optionOne:req.body.optionOne,optionTwo:req.body.optionTwo,verify:false};
            }

            Poll.findOneAndUpdate({_id:req.body._id},{
                $set: set
            },{returnOriginal: false},function (err, savedPoll) {
                if (err) {
                    try {
                        console.log(err);
                        res.send("Poll not found");
                    } catch (err) {
                        res.send(err);
                    }
                }else{
                    console.log(savedPoll);
                    res.send("Update success");
                }
            });
        }
    });

});
*/

//Get all polls
router.get('/getPolls',function (req, res) {
    let data = {success: "0", data: ''};
    try {
        News.find({type: "Poll", verify: true}, {optionOneCount: 0, optionTwoCount: 0}, function (err, poll) {
            if (err) {
                console.log(err);
                res.send(data);
            } else {
                data.success = "1";
                poll = sortJson(poll, 'date', 'des');
                data.data = poll;
                res.send(data);
            }
        });
    }catch(err){
        data.data = "Error in /getPolls: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Delete polls post request
/*
router.post('/deletePoll', function (req, res) {
    let user_id = req.body.user_id;
    let user_access = 0;
    Admin.findOne({_id:user_id},function (err, adminUser) {
        if(err){
            console.log("Error while finding user: " +err);
        }else{
            user_access = adminUser.access;
            let verified = false;
            Poll.findOne({_id: req.body._id},function (err,poll) {
                if(err){
                    console.log("Finding poll error: " + err);
                }else {
                    verified = poll.verify;
                }
            });

            let data={success:"0",data:""};
            if(verified || user_access){
                Poll.deleteOne({_id: req.body._id}, function (err, result) {
                    if (err) {
                        console.log("Error");
                        res.send(data);
                    }else{
                        data.success = "1";
                        data.data = "Poll deleted successfully";
                        res.send(data);
                    }

                });
            }else{
                data.data = "You don't have privilege for this action";
                res.send(data);
            }
        }
    });


});

*/
//Increase poll counter
router.post('/pollCount',function (req, res) {
    let data = {success: "0", data: "", optionOneCount: "0", optionTwoCount: "0"};
    try {
        let option = req.body.option;
        let username = req.body.username;
        let newsId = req.body.news_id;
        News.findOne({_id: newsId}, function (err, news) {
            if (err) {
                console.log(err);
                res.send(data);
            } else {
                console.log("Found poll");
                SavedPoll.findOne({username: username, poll_id: newsId}, function (err, savedPoll) {
                    console.log("SP: " + savedPoll);
                    if (err) {
                        console.log(err);
                        res.send(data);
                    } else {
                        if (savedPoll == null) {
                            let savedPoll = SavedPoll();
                            savedPoll.username = username;
                            savedPoll.poll_id = newsId;
                            savedPoll.option = option;
                            savedPoll.save(function (err, savedPollDetails) {
                                if (err) {
                                    console.log("Error saving poll for user");
                                } else {
                                    console.log("Saved poll for user");
                                    let incValue;
                                    if (option == "0") {
                                        incValue = {optionOneCount: 1};
                                    } else {
                                        incValue = {optionTwoCount: 1};
                                    }
                                    News.findOneAndUpdate({_id: newsId}, {
                                        $inc: incValue
                                    }, {new: true}, function (err, savedPoll) {
                                        if (savedPoll) {
                                            data.success = "1";
                                            data.data = "Voted successfully";
                                            data.optionOneCount = savedPoll.optionOneCount;
                                            data.optionTwoCount = savedPoll.optionTwoCount;
                                            res.send(data);
                                        } else {
                                            data.data = err;
                                            res.send(data);
                                        }
                                    });
                                }
                            });
                        } else {
                            data.data = "Already voted";
                            res.send(data);
                        }
                    }
                });

            }
        });
    }catch(err){
        data.data = "Error in /getPolls: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get polled news by user
router.get("/getPoll/:username",function (req, res) {
    let data = {success:"0",data:""};
    try {
        SavedPoll.find({username: req.params.username, verify: true}, {
            optionOneCount: 0,
            optionTwoCount: 0
        }, function (err, savedPolls) {
            if (err) {
                console.log(err);
                res.send(data);
            } else {
                data.success = "1";
                data.data = savedPolls;
                res.send(data);
            }
        });
    }catch(err){
        data.data = "Error in /getPoll/:username: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Post-news/poll
router.post('/postNews', function (req, res) {
    try {
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                user_access = adminUser.access;
                let newNews = News();
                newNews.title = req.body.title;
                newNews.titleSearch = req.body.title.split(' ').map(k => k.toLowerCase());
                newNews.description = req.body.description;
                newNews.url = req.body.url;
                newNews.category = req.body.category;
                newNews.imageURL = req.body.imageURL;
                newNews.source = req.body.source;
                newNews.date = new Date().getTime() / 1000;
                if (user_access) {
                    newNews.verify = true;
                } else {
                    newNews.verify = false;
                }
                newNews.tags = req.body.category.split(', ').map(k => k.toLowerCase());
                newNews.type = req.body.type;
                newNews.question = req.body.question;
                newNews.optionOne = req.body.optionOne;
                newNews.optionTwo = req.body.optionTwo;
                newNews.optionOneCount = 0;
                newNews.optionTwoCount = 0;
                newNews.uniqueUrl = newNews.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
                let date = newNews.date.split('.');
                newNews.uniqueUrl += date[0];
                newNews.category.split(', ').forEach((cat) => {
                    Cat.findOneAndUpdate({category: req.body.category}, {
                        $inc: {
                            count: 1
                        }
                    }, {returnOriginal: false}, function (err, category) {
                        if (err) {
                            try {
                                console.send("Error incrementing category count");
                            } catch (err) {
                                console.log(err);
                            }
                        } else {
                            if (!category) {
                                console.log("Not found");
                            } else {
                                if (cat == "") {
                                    console.log("Empty Category. Not adding");
                                } else {
                                    let newCat = Cat();
                                    if (cat.charAt(cat.length) == ',') {
                                        cat = cat.substr(0, cat.length - 2);
                                    }
                                    /*newCat.category = cat;

                                    newCat.save(function (err, savedCat) {
                                        if (err) {
                                            try {
                                                console.log(err);
                                            } catch (err) {
                                                console.log(err);
                                            }
                                            console.log(savedCat);
                                        }
                                    });*/
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
            }
        });
    }catch(err){
        let data = "Error in /postNews: " + err;
        console.log(data);
        res.send(data)
    }
});

//Update news - all fields
router.post('/updateNews', function (req, res) {
    try {
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                user_access = adminUser.access;
                let set;
                if (user_access) {
                    set = {
                        title: req.body.title,
                        titleSearch: req.body.title.split(' ').map(k => k.toLowerCase()),
                        description: req.body.description,
                        url: req.body.url,
                        category: req.body.category,
                        tags: req.body.category.split(', ').map(k => k.toLowerCase()),
                        imageURL: req.body.imageURL,
                        source: req.body.source,
                        count: req.body.count,
                        verify: true,
                        type: req.body.type,
                        question: req.body.question,
                        optionOne: req.body.optionOne,
                        optionTwo: req.body.optionTwo
                    };
                } else {
                    set = {
                        title: req.body.title,
                        titleSearch: req.body.title.split(' ').map(k => k.toLowerCase()),
                        description: req.body.description,
                        url: req.body.url,
                        category: req.body.category,
                        tags: req.body.category.split(', ').map(k => k.toLowerCase()),
                        imageURL: req.body.imageURL,
                        source: req.body.source,
                        count: req.body.count,
                        verify: false,
                        type: req.body.type,
                        question: req.body.question,
                        optionOne: req.body.optionOne,
                        optionTwo: req.body.optionTwo
                    };
                }

                News.findOneAndUpdate({_id: req.body._id}, {
                    $set: set
                }, {returnOriginal: false}, function (err, news) {
                    if (err) {
                        try {
                            res.send("Error updating: " + err);
                        } catch (er) {
                            console.log(er);
                        }
                    } else {
                        if (!news) {
                            res.send("Not found");
                        } else {
                            //Decrementing count acc to old categories
                            news.category.split(', ').forEach((category) => {
                                Cat.findOneAndUpdate({category: category}, {
                                    $inc: {
                                        count: -1
                                    }
                                }, function (err, success) {
                                    if (err) {
                                        console.log("Error decrementing category")
                                    } else {
                                        console.log("Decremented");
                                    }
                                });
                            });

                            //Incrementing count acc to new categories
                            req.body.category.split(', ').forEach((cat) => {
                                Cat.findOneAndUpdate({category: cat}, {
                                    $inc: {
                                        count: 1
                                    }
                                }, {returnOriginal: false}, function (err, category) {
                                    if (err) {
                                        try {
                                            console.send("Error incrementing category count: " + err);
                                        } catch (er) {
                                            console.log(er);
                                        }
                                    } else {
                                        if (!category) {
                                            console.log("Not found");
                                        } else {
                                            if (cat == "") {
                                                console.log("Empty Category. Not adding");
                                            } else {
                                                let newCat = Cat();
                                                if (cat.charAt(cat.length) == ',') {
                                                    cat = cat.substr(0, cat.length - 2);
                                                }
                                                /*newCat.category = cat;

                                                newCat.save(function (err, savedCat) {
                                                    if (err) {
                                                        try {
                                                            console.log("Error adding category: " + err);
                                                        } catch (er) {
                                                            console.log(er);
                                                        }
                                                        console.log(savedCat);
                                                    }
                                                });*/
                                            }
                                        }
                                    }
                                });
                            });
                            res.send("Successfully updated");
                        }
                    }
                });
            }
        });
    }catch(err){
        let data = "Error in /updateNews: " + err;
        console.log(data);
        res.send(data)
    }
});


//Delete a news
router.post('/deleteNews', function (req, res) {
    let data = {success: "0", data: ""};
    try {
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                user_access = adminUser.access;
                let verified = false;
                News.findOne({_id: req.body._id}, function (err, news) {
                    if (err) {
                        console.log("Finding news error: " + err);
                    } else {
                        verified = news.verify;
                    }
                });

                if (user_access || !verified) {
                    let tags = "";
                    News.findOne({_id: req.body._id}, function (err, news) {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log("News = " + news);
                            tags = news.category.split(', ');
                            console.log("News tag: " + news.tags);
                            News.deleteOne({_id: req.body._id}, function (err, results) {
                                if (err) {
                                    console.log("Error");
                                    res.send(data);
                                } else {
                                    if (tags != "") {
                                        tags.forEach((category) => {
                                            Cat.findOneAndUpdate({category: category}, {
                                                $inc: {
                                                    count: -1
                                                }
                                            }, function (err, updatedCat) {
                                                if (err) {
                                                    console.log("Error deleting category")
                                                } else {
                                                    data.success = "1";
                                                    data.data = "Deleted news and category";
                                                    if(updatedCat.count < 0){
                                                        Cat.findOneAndDelete({category: category});
                                                    }
                                                    res.send(data);
                                                }
                                            });
                                        });
                                    } else {
                                        console.log("Error deleting news");
                                        res.send(data);
                                    }

                                }
                            });
                        }
                    });
                } else {
                    data.data = "You don't have privilege for this action";
                    res.send(data);
                }
            }
        });
    }catch(err){
        data.data = "Error in /deleteNews: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get verified news - for users
router.get('/getNews', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        News.find({verify: true}, function (err, news) {
            if (err) {
                console.log(err);
                res.send(data);
            }
            data.success = "1";
            news = sortJson(news, 'date', 'des');
            data.data = news;
            res.send(data);
            //console.log(data)
        });
    }catch(err){
        data.data = "Error in /getNews: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get all news - for authors
router.get('/getAllNews/:user_id', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.params.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in getAllNews while finding user: " + err);
            } else {
                if (adminUser.access == 1) {
                    News.find({}, function (err, news) {
                        if (err) {
                            console.log(err);
                            res.send(data);
                        }
                        data.success = "1";
                        news = sortJson(news, 'date', 'des');
                        data.data = news;
                        res.send(data);
                        //console.log(data)
                    });
                } else {
                    News.find({verify: false}, function (err, news) {
                        let data = {success: "0", data: ''};
                        if (err) {
                            console.log(err);
                            res.send(data);
                        }
                        data.success = "1";
                        news = sortJson(news, 'date', 'des');
                        data.data = news;
                        res.send(data);
                        //console.log(data)
                    });
                }
            }
        });
    }catch(err){
        data.data = "Error in /getAllNews/:user_id: " + err;
        console.log(data.data);
        res.send(data)
    }

});


//Get news by category
router.get('/getNewsByCategory/:category', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let callback = (err, newsArray) => {
            if (err) {
                console.info(err);
                res.send(data)
            } else {
                console.log(newsArray);
                data.success = "1";
                newsArray = sortJson(newsArray, 'date', 'des');
                data.data = newsArray;
                res.send(data);
            }
        };
        console.info(req.body.category);
        News.find({tags: req.params.category.toLowerCase(), verify: true}, {category: 0}, callback);
    }catch(err){
        data.data = "Error in /getNewsByCategory/:category: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get news by url
router.get('/news/:url', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let callback = (err, news) => {
            if (err) {
                console.info(err);
                res.send(data);
            } else {
                console.log(req.params.url);
                console.log(news);
                data.success = "1";
                data.data = news;
                res.send(data);
            }
        };
        console.info(req.body.category);
        News.find({uniqueUrl: req.params.url}, callback);
    }catch(err){
        data.data = "Error in /news/:url: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Search news using title
router.post('/searchNewsByTitle', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.body.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in getAllNews while finding user: " + err);
            } else {
                let searchCriteria;
                if (adminUser.access == 1) {
                    searchCriteria = {titleSearch: {$regex: '^' + req.body.title}};
                } else {
                    searchCriteria = {titleSearch: {$regex: '^' + req.body.title}, verify: false};
                }
                News.find(searchCriteria, {
                    tags: 0,
                    titleSearch: 0,
                    url: 0,
                    tagPrimary: 0,
                    tagSecondary: 0,
                    source: 0,
                    date: 0,
                    count: 0,
                    category: 0
                }, function (err, newsArray) {
                    if (err) {
                        console.info(err);
                        res.send(data)
                    } else {
                        console.log(newsArray);
                        data.success = "1";
                        data.data = newsArray;
                        res.send(data);
                    }
                });
            }
        });
    }catch(err){
        data.data = "Error in /searchNewsByTitle: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Get news by id
router.post('/getNewsById/:id',function (req,res) {
    let data = {success: "0", data: ''};
    try {
        News.findOne({_id: req.params.id}, {titleSearch: 0, count: 0}, function (err, news) {
            if (err) {
                res.send(data);
            } else {
                console.log(news);
                data.data = news;
                data.success = 1;
                res.send(data);
            }
        });
    }catch(err){
        data.data = "Error in /getNewsById/:id : " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get news by title
router.post('/getNewsByTitle',function (req,res) {
    let data = {success: "0", data: ''};
   try {
       News.findOne({title: req.body.title}, {titleSearch: 0, date: 0, count: 0}, function (err, news) {
           if (err) {
               res.send(data);
           } else {
               console.log(news);
               data.data = news;
               data.success = 1;
               res.send(data);
           }
       });
   }catch(err){
       data.data = "Error in /getNewsByTitle : " + err;
       console.log(data.data);
       res.send(data)
   }
});


//Bookmarking
router.post('/bookmark', function (req, res) {
    let data = {success: "0", data: ""};
    try {
        let bookmarkedNews = BookmarkedNews;
        console.log("news id= " + req.body.news_id);
        News.findOne({_id: req.body.news_id}, function (err, news) {
            if (err) {
                console.log(err);
                res.send(data);
            } else {
                console.log("Found news");
                let searchCriteria = {news: news, username: req.body.username};
                let record = {news: news, username: req.body.username, news_id: req.body.news_id};
                bookmarkedNews.update(searchCriteria, record, {upsert: true}, function (err, bkNews) {
                    if (err) {
                        res.send(data);
                    } else {
                        data.success = "1";
                        data.data = bkNews;
                        res.send(data);
                    }
                });
            }
        });
    }catch(err){
        data.data = "Error in /bookmark: " + err;
        console.log(data.data);
        res.send(data)
    }
});

/*//Multiple bookmarks
router.post('/bookmarkMultiple', function (req, res) {

    let bookmarkedNews = BookmarkedNews();
    bookmarkedNews.username = req.body.username;
    let news_array = req.body.news_array;
    for(let news_id in news_array){
        console.log("news id= " + news_id);
        News.findOne({_id:news_id},function (err, news) {
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
    }

});*/

//Get news bookmarked by user
router.post('/getBookmarkedNews',function (req, res) {
    let data = {success: "0", data: ''};
    try {
        BookmarkedNews.find({username: req.body.username}, {username: 0}, function (err, bookmarkedNewsArray) {
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
    }catch(err){
        data.data = "Error in /getBookmarkedNews: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Delete bookmark
router.post('/deleteBookmark', function (req, res) {
    let data = {success: "0", data: ""};
    try {
        BookmarkedNews.deleteOne({username: req.body.username, news_id: req.body.news_id}, function (err, results) {
            if (err) {
                console.log("Error");
                res.send(data);
            } else {
                console.log("Bookmark removed " + results);
                data.success = "1";
                data.data = "Bookmark Removed";
                res.send(data);
            }

        });
    }catch(err){
        data.data = "Error in /deleteBookmark: " + err;
        console.log(data.data);
        res.send(data)
    }
});

module.exports = router;

