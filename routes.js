var express = require('express');
var router = express.Router();

var User = require('./models/user');
var News = require('./models/news');

//Register post request
router.post('/register',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;

    var newUser = User();
    newUser.username = username;
    newUser.password = password;

    //Call Mongoose inbuilt save method
    newUser.save(function (err,savedUser) {
        if(err){
            throw err;
        }
        console.log(savedUser);
        res.send("Save success");
    });
});
//Login post request
router.post('/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;

    //Find user with given credentials in the database
    User.findOne({username:username,password:password},function (err,user) {
        if(err){
            throw err;
        }
        if(!user){
            res.send("Not found");
        }else{
            console.log(user);
            res.send("Found");
        }
    });
});

//Post-news post request
router.post('/postNews',function (req,res) {

    var newNews = News();
    newNews.title = req.body.title;
    newNews.description = req.body.description;
    newNews.url = req.body.url;
    newNews.category = req.body.category;
    newNews.tagPrimary = req.body.tagPrimary;
    newNews.tagSecondary = req.body.tagSecondary;
    newNews.imageURL = req.body.imageURL;
    newNews.source = req.body.source;
    newNews.date = req.body.date;
    newNews.count = 0;

    newNews.save(function (err,savedNews) {
        if(err){
            throw err;
        }
        console.log(savedNews);
        res.send("Save success");
    });
});

router.post('/updateNews',function (req,res) {

    News.findOneAndUpdate({_id:req.body._id},{$set:{title:req.body.title,description:req.body.description,url:req.body.url,category:req.body.category,tagPrimary:req.body.tagPrimary,tagSecondary:req.body.tagSecondary,imageURL:req.body.imageURL,source:req.body.source,date:req.body.date,count:req.body.count}},{returnOriginal:false},function (err,news) {
        if(err){
            throw err;
        }
        if(!news){
            res.send("Not found");
        }else{
            console.log("Successfully updated");
        }
    });
});
//Maintaining counter for Top Stories
router.post('/increaseNewsCounter',function (req,res) {

    News.findOneAndUpdate({title:req.body.title},{$set: {count:req.body.count}},{returnOriginal:false},function (err,news) {
        if(err){
            throw err;
        }
        if(!news){
            res.send("Not found");
        }else {
            console.log("Successfully updated")
        }
    });
});
//Bookmarking
router.post('/increaseNewsCounter',function (req,res) {

    News.findOneAndUpdate({title:req.body.title},{$set: {count:req.body.count}},{returnOriginal:false},function (err,news) {
        if(err){
            throw err;
        }
        if(!news){
            res.send("Not found");
        }else {
            console.log("Successfully updated")
        }
    });
});

router.get('/getNews',function (req,res) {
    News.find({},function (err,news) {
        var data = {success:"0",data:''};
        if(err){
            console.log(err);
            res = data;
        }
        console.log(news);
        data.success = "1";
        data.data = news;
        res.send(data);
        //console.log(data)
    });
});

module.exports = router;
