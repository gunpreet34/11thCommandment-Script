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

//Register post request
/*router.get('/registerAdmin',function (req, res) {
    let html = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "\n" +
        "<head>\n" +
        "  <title> Register Form </title>\n" +
        "    <meta charset=\"utf-8\">\n" +
        "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
        "    <meta name=\"description\" content=\"\">\n" +
        "    <meta name=\"author\" content=\"\">\n" +
        "\n" +
        "    <!-- Bootstrap Core CSS -->\n" +
        "    <link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\" rel=\"stylesheet\">\n" +
        "\t<style>\n" +
        "\tp{\n" +
        "\t\tfont-family: 'Roboto', sans-serif;\n" +
        "      font-size: 48px;\n" +
        "\t  text-align:center;\n" +
        "\t}\n" +
        "\t</style>\n" +
        "</head>\n" +
        "\n" +
        "<body>\n" +
        "\n" +
        "                        <!-- MY CODE -->\n" +
        "                        <form action='/registerSuccess' method=\"post\" enctype=\"multipart/form-data\">\n" +
        "                        \n" +
        "                          <div class=\"container\" style=\"margin:auto; padding:50px;\">\n" +
        "\t\t\t\t\t\t\t<p>Enter The Details</p>\n" +
        "                            <div class=\"row\">\n" +
        "                              <div class=\"col-lg-6\">\n" +
        "                                <div class=\"form-group\">\n" +
        "                                  <label>Name</label>\n" +
        "                                  <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"Enter name\" required>\n" +
        "                                </div>\n" +
        "\t\t\t\t\t\t\t\t<div class=\"form-group\">\n" +
        "                                  <label>User access level</label>\n" +
        "                                  <select class=\"form-control\" name=\"access\">\n" +
        "\t\t\t\t\t\t\t\t\t  <option value = \"Editor\">Editor</option>\n" +
        "\t\t\t\t\t\t\t\t\t  <option value = \"Admin\">Admin</option>\n" +
        "\t\t\t\t\t\t\t\t\t  </select>\n" +
        "                                </div>\n" +
        "\t\t\t\t\t\t\t\t\n" +
        "\t\t\t\t\t\t\t\t<div class=\"form-group\">\n" +
        "                                  <label>Password</label>\n" +
        "                                  <input class=\"form-control\" type=\"password\" name=\"password\" placeholder=\"Enter Password\" required>\n" +
        "                                </div>\n" +
        "\t\t\t\t\t\t\t\t<div class=\"form-group\">\n" +
        "                                  <label>Verify Password</label>\n" +
        "                                  <input class=\"form-control\" type=\"password\" name=\"rpt_password\" placeholder=\"Re-Enter Password\" required>\n" +
        "                                </div>\n" +
        "                             \n" +
        "                           </div>\n" +
        "\t\t\t\t\t\t   \n" +
        "\t\t\t\t\t\t   <div class=\"col-lg-6\">\n" +
        "\n" +
        "\t\t\t\t\t\t\t <div class=\"form-group\">\n" +
        "                                  <label>Mobile Number</label>\n" +
        "                                  <input class=\"form-control\" type=\"number\" name=\"mobile\" placeholder=\"Enter Mobile Number\" required>\n" +
        "                                </div>\n" +
        "                                <div class=\"form-group\">\n" +
        "                                  <label>Email-ID</label>\n" +
        "                                  <input class=\"form-control\" type=\"email\" name=\"email\" placeholder=\"Enter Email\" required>\n" +
        "                                </div>\n" +
        "                         \t\n" +
        "                              \n" +
        "                    </div>\n" +
        "                  </div>\n" +
        "\t\t\t\t  <p id=\"buttons\"style=\"margin:auto; text-align:center;\">\n" +
        "                              <button type=\"submit\" name=\"submit\" class=\"btn btn-success\">Submit</button>\n" +
        "                              <a href=\"#\"><button type=\"button\" class=\"btn btn-danger\">Reset</button></a>\n" +
        "                              </p>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "            </form></div>\n" +
        "            <!-- /.container-fluid -->\n" +
        "\n" +
        "    <!-- Bootstrap Core JavaScript -->\n" +
        "    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script>\n" +
        "\n" +
        "</body>\n" +
        "\n" +
        "</html>\n";
    res.send(html);
});*/

//Users
router.get('/registerAdmin', function(req, res){
    res.render('adminRegister.ejs');
});


router.post('/registerSuccess',function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let access = req.body.access;
    let password = req.body.password;
    let number = req.body.number;
    Admin
    res.send('Successfully submitted');
});

router.post('/register', function (req, res) {
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
});

//Add a new Category
router.post('/addCategory', function (req, res) {
    let cat = Cat();
    cat.category = req.body.category;
    /*let image = req.body.image;
    image = image.split(';base64,').pop();
    fs.writeFile(cat.category + ".jpg",image,{encoding:'base64'},function (err) {
        if(!err)
            console.log('File created');
        else
            console.log('Error');
    });*/
    cat.save({category:req.body.category},function (err, result) {
        if(err){
            res.send(err);
        }else{
            res.send("Category added");
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

//Get categories with news
router.get('/getCategoriesWithNews', function (req, res) {
    Cat.find({count:{ $gt: 0}}, function (err, cats) {
        let data = {success: "0", data: ''};
        if (err) {
            console.log(err);
            res.send(data);
        }else{
            console.log(cats);
            data.success = "1";
            data.data = cats;
            res.send(data);

        }
    });
});

//Add a new Poll
router.post('/addPoll', function (req, res) {
    let poll = Poll();
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
    poll.shareUrl = poll.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
    poll.shareUrl += "_";
    let date = poll.date.split('.');
    poll.shareUrl += date[0];
    poll.save(function (err, savedPoll) {
        if (err) {
            try {
                res.send("Already added poll");
                console.log(err);
                return;
            } catch (err) {
                res.send(err);
            }
        }else{
            console.log(savedPoll);
            res.send("Save success");
        }
    });
    /*let data = {success:"0",data:""};
    let searchCriteria={title:req.body.title,description:req.body.description};
    let record={title:req.body.title,description:req.body.description,url:req.body.url,imageURL:req.body.imageURL,question:req.body.question,optionOne:req.body.optionOne,optionTwo:req.body.optionTwo,date:new Date().getTime()/1000};
    poll.update(searchCriteria,record,{upsert:true},function (err, pollDetails) {
        if (err) {
            res.send(data);
        }else{
            data.success = "1";
            data.data = pollDetails;
            res.send(data);
        }
    });*/


});

//Update Poll
router.post('/updatePoll', function (req, res) {
    Poll.findOneAndUpdate({_id:req.body._id},{
        $set: {
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            imageURL: req.body.imageURL,
            question: req.body.question,
            optionOne:req.body.optionOne,
            optionTwo:req.body.optionTwo
        }
    },{returnOriginal: false},function (err, savedPoll) {
        if (err) {
            try {
                res.send("Poll not found");
                console.log(err);
                return;
            } catch (err) {
                res.send(err);
            }
        }else{
            console.log(savedPoll);
            res.send("Update success");
        }
    });

});

//Get all polls
router.get('/getPolls',function (req, res) {
    Poll.find({}, function (err, poll) {
        let data = {success: "0", data: ''};
        if (err) {
            console.log(err);
            res.send(data);
        }else{
            data.success = "1";
            poll = sortJson(poll,'date','des');
            data.data = poll;
            res.send(data);
        }
    });
});

//Delete polls
router.post('/deletePoll', function (req, res) {

    let data={success:"0",data:""};
    Poll.deleteOne({_id: req.body._id}, function (err, result) {
        if (err) {
            console.log("Error");
            res.send(data);
        }else{
            data.success = "1";
            data.data = "Poll deleted successfully";
            res.send(data);
        }

    })
});

//Increase poll counter
router.post('/pollCount',function (req, res) {
    let option = req.body.option;
    let username = req.body.username;
    let pollId = req.body.poll_id;
    Poll.findOne({_id:pollId},function (err, poll) {
        let data = {success:"0",data:"",optionOne:"0",optionTwo:"0"};
        if(err){
            console.log(err);
            res.send(data);
        }else{
            console.log("Found poll");
            SavedPoll.findOne({username:username,poll_id:pollId},function (err, savedPoll) {
                console.log("SP: " + savedPoll);
                if(err){
                    console.log(err);
                    res.send(data);
                }else{
                    if(savedPoll == null){
                        let savedPoll = SavedPoll();
                        savedPoll.username = username;
                        savedPoll.poll_id = pollId;
                        savedPoll.option = option;
                        savedPoll.save(function (err, savedPollDetails) {
                            if(err){
                                console.log("Error saving poll for user");
                            }else{
                                console.log("Saved poll for user");
                                if(option == "0"){
                                    Poll.findOneAndUpdate({_id:pollId},{
                                        $inc: {
                                            optionOneCount:1
                                        }
                                    },{new: true},function (err, savedPoll) {
                                        if(savedPoll){
                                            data.success = "1";
                                            data.optionOne = savedPoll.optionOneCount;
                                            data.optionTwo = savedPoll.optionTwoCount;
                                            res.send(data);
                                        }else{
                                            data.data = err;
                                            res.send(data);
                                        }
                                    });
                                }else{
                                    Poll.findOneAndUpdate({_id:pollId},{
                                        $inc: {
                                            optionTwoCount:1
                                        }
                                    },{new: true},function (err, savedPoll) {
                                        if(savedPoll){
                                            data.success = "1";
                                            data.optionOne = savedPoll.optionOneCount;
                                            data.optionTwo = savedPoll.optionTwoCount;
                                            res.send(data);
                                        }else{
                                            data.data = err;
                                            res.send(data);
                                        }
                                    });
                                }

                            }
                        });
                    }else{
                        data.data = "Already voted";
                        res.send(data);
                    }
                }
            });

        }
    });

});

//Get polled news by user
router.get("/getPoll/:username",function (req, res) {
    let data = {success:"0",data:""};
    SavedPoll.find({username:req.params.username},function (err,savedPolls) {
        if(err){
            console.log(err);
            res.send(data);
        }else{
            data.success = "1";
            data.data = savedPolls;
            res.send(data);
        }
    });
});

//Post-news
router.post('/postNews', function (req, res) {

    let newNews = News();
    newNews.title = req.body.title;
    newNews.titleSearch = req.body.title.split(' ').map(k => k.toLowerCase());
    newNews.description = req.body.description;
    newNews.url = req.body.url;
    newNews.category = req.body.category;
    newNews.imageURL = req.body.imageURL;
    newNews.source = req.body.source;
    newNews.date = new Date().getTime() / 1000;
    newNews.tags = req.body.category.split(', ').map(k => k.toLowerCase());
    //newNews.uniqueUrl = "https://commandment-api.herokuapp.com/news/";
    newNews.uniqueUrl = newNews.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
    let date = newNews.date.split('.');
    newNews.uniqueUrl += date[0];
    newNews.tags.forEach((cat) => {
        Cat.findOneAndUpdate({category: req.body.category}, {
            $inc: {
                count:1
            }
        }, {returnOriginal: false}, function (err, category) {
            if (err) {
                try {
                    console.send("Error incrementing category count");
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
            imageURL: req.body.imageURL,
            source: req.body.source,
            count: req.body.count,

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
                //Decrementing count acc to old categories
                news.category.split(', ').forEach((category)=>{
                    Cat.findOneAndUpdate({category: category}, {$inc:{
                        count: -1
                    }},function (err, success) {
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
                            count:1
                        }
                    }, {returnOriginal: false}, function (err, category) {
                        if (err) {
                            try {
                                console.send("Error incrementing category count" );
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


//Delete a news
router.post('/deleteNews', function (req, res) {    
    let tags = "";
    News.findOne({_id: req.body._id},function (err, news) {
        if (err) {
            console.log(err);
        }else{
            let data = {success:"0",data:""};
            //console.log("News = " + news);
            tags = news.tags;
            console.log("News tag: " + news.tags);
            News.deleteOne({_id: req.body._id}, function (err, results) {
                if (err) {
                    console.log("Error");
                    res.send(data);
                } else {
                    if (tags != "") {
                        tags.forEach((category)=>{
                            Cat.findOneAndUpdate({category: category}, {$inc:{
                                count: -1
                            }},function (err, success) {
                                if (err) {
                                    console.log("Error deleting category")
                                } else {
                                    data.success = "1";
                                    data.data = "Deleted news and category";
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

        /*if (results.n > 0) {
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
        }*/

});

//Get all news
router.get('/getNews', function (req, res) {
    News.find({}, function (err, news) {
        let data = {success: "0", data: ''};
        if (err) {
            console.log(err);
            res.send(data);
        }
        //console.log(news);
        data.success = "1";
        news = sortJson(news,'date','des');
        data.data = news;
        res.send(data);
        //console.log(data)
    });
});

//Get news by uniqueUrl


//Get news by category
router.get('/getNewsByCategory/:category', function (req, res) {
    let callback = (err, newsArray) => {
        let data = {success: "0", data: ''};
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

});

//Get news by url
router.get('/news/:url', function (req, res) {
    let callback = (err, news) => {
        let data = {success: "0", data: ''};
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

});

//Search news using title
router.post('/searchNewsByTitle', function (req, res) {
    let callback = (err, newsArray) => {
        let data = {success: "0", data: ''};
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

//Get news by id
router.post('/getNewsById/:id',function (req,res) {
    News.findOne({_id:req.params.id},{titleSearch:0,count:0},function (err,news) {
        let data = {success: "0", data: ''};
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

//Get news by title
router.post('/getNewsByTitle',function (req,res) {
   News.findOne({title:req.body.title},{titleSearch:0,date:0,count:0},function (err,news) {
       let data = {success: "0", data: ''};
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


//Bookmarking
router.post('/bookmark', function (req, res) {

    let bookmarkedNews = BookmarkedNews;
    console.log("news id= " + req.body.news_id);

    News.findOne({_id:req.body.news_id},function (err, news) {
        let data = {success:"0",data:""};
        if(err){
            console.log(err);
            res.send(data);
        }else{
            console.log("Found news");
            let searchCriteria={news:news,username:req.body.username};
            let record={news:news,username:req.body.username,news_id:req.body.news_id};
            bookmarkedNews.update(searchCriteria,record,{upsert:true},function (err, bkNews) {
                if (err) {
                    res.send(data);
                }else{
                    data.success = "1";
                    data.data = bkNews;
                    res.send(data);
                }
            });
        }
    });

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
    BookmarkedNews.find({username:req.body.username},{username:0},function (err,bookmarkedNewsArray) {
        let data = {success: "0", data: ''};
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

    let data={success:"0",data:""};
    BookmarkedNews.deleteOne({username: req.body.username,news_id:req.body.news_id}, function (err, results) {
        if (err) {
            console.log("Error");
            res.send(data);
        }else{
            console.log("Bookmark removed " + results);
            data.success = "1";
            data.data = "Bookmark Removed";
            res.send(data);
        }

    })
});

module.exports = router;

