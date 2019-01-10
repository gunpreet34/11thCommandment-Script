let express = require('express');
let router = express.Router();
let sortJson = require('sort-json-array');
let fs = require('fs');
let admin = require('firebase-admin');
let csvToJson = require('convert-csv-to-json');
let Converter = require("csvtojson").Converter;
let path = require('path');
let multer  = require('multer');
//let upload = multer({ dest: 'uploads/csv/' });
let uploadCsv = {
    storage : multer.diskStorage({
        destination : function (req, file, next) {
            next(null,'./uploads/csv');
        },
        filename : function (req, file, next) {
            let ext = file.mimetype.split('/')[1];
            next(null,file.fieldname + ext);
        }
    })
};
let upload = multer().single();

//Importing models
let User = require('./models/user');
let News = require('./models/news');
let BookmarkedNews = require('./models/bookmarkedNews');
let Cat = require('./models/category');
let SavedPoll = require('./models/savedPoll');
let Admin = require('./models/admin');
let Advertisement = require('./models/advertisement');

let serviceAccount=require("./private/commandment-1542387209123-firebase-adminsdk-oazeh-e68716fd65.json");

//Initialize app for firebase use
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://noti.firebaseio.com"
});

//Method to push notification to firebase
let pushNotification = function (title,message,imageURL,id) {
    let topic = 'global';
    let payload={
        data:{
            title:title,
            message:message,
            image:imageURL,
            timestamp:""+   (new Date()).getTime(),
            news_id: id.toString()
        },
        topic:topic
    };

    admin.messaging().send(payload).then(function (response) {
        console.log("Successfully sent : "+response);
    }).catch(function (error) {
        console.log("Error: "+error);
    });
};

//Upload Multiple news
router.get('/uploadMultipleNews',function (req, res) {
    res.render('multipleNews.ejs');
});

router.post('/postMultipleNews',multer(uploadCsv).single('inputFile'),function (req, res, next) {
    let tmp_path = req.file.path;
    let target_path = 'uploads/' + req.file.originalname;
    let src = fs.createReadStream(tmp_path);
    let dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    let converter = new Converter({});
    converter.fromFile("./uploads/csv/" + req.file.originalname,function(err,result){
        // if an error has occured then handle it
        if(err){
            console.log("An Error Has Occured");
            console.log(err);
        }
        // create a variable called json and store
        // the result of the conversion
        var json = result;
        console.log(json);
        for(let i=0; i<json.length;i++){
            console.log(json[i]);
        }
    });

});


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
                    if(savedAdmin != null){
                        data.success = "1";
                        data.data = "User " + req.body.name + " saved successfully";
                        data.data = savedAdmin.data;
                    }else{
                        data.data = "Unexpected Error";
                    }
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
    let data = {success:0,data:"",access:0};
    try{
        let email = req.body.email;
        let password = req.body.password;
        Admin.findOne({email:email,password:password},function (err, admin) {
            if(err){
                data.data = err;
            }else{
                if(admin != null){
                    data.success="1";
                    data.access = admin.access;
                    data.data = admin._id;
                }else{
                    data.data = "Not found";
                }
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
    let data = {success:0,data:""};
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
                data.data = err;
            }else {
                if(savedUser != null){
                    data.success = 1;
                    data.data = "Registered successfully";
                }else{
                    data.data = "Already taken";
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /register: " + err;
        res.send(data)
    }
});
//Normal user login post request
router.post('/login', function (req, res) {
    let data = {success:0,data:""};
    try {
        let username = req.body.username;
        let password = req.body.password;

        //Find user with given credentials in the database
        User.findOne({username: username, password: password}, function (err, user) {
            if (err) {
                data.data = err;
            }
            if (!user) {
                data.data = "Invalid credentials";
            } else {
                data.success = 1;
                data.data = "Welcome " + user.name;
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /login: " + err;
        console.log(data);
        res.send(data)
    }
});

//Add a new Category post request
router.post('/addCategory', function (req, res) {
    try {
        let cat = Cat();
        cat.category = req.body.category;
        cat.imageURL = req.body.image;
        /*let data = image.replace(/^data:image\/\w+;base64,/, "");
        let buffer = new Buffer(data, 'base64');
        fs.writeFile(cat.category, buffer);
        */
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                if (adminUser)
                    user_access = adminUser.access;
                if (user_access) {
                    cat.verify = true;
                }else {
                    cat.verify = false;
                }
                cat.save({category: req.body.category}, function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send("Category added");
                    }
                });
            }
        });
    }catch(err){
        let data = "Error in /addCategory: " + err;
        console.log(data);
        res.send(data)
    }
});

//Update a category
router.post('/updateCategory', function (req, res) {
    try {
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                if(adminUser)
                    user_access = adminUser.access;
                let set;
                if (user_access) {
                    set = {
                        category: req.body.category,
                        imageURL:req.body.imageURL,
                        verify: true
                    };
                } else {
                    set = {
                        category: req.body.category,
                        imageURL:req.body.imageURL,
                        verify: false
                    };
                }
                Cat.findOneAndUpdate({_id: req.body._id}, {
                    $set: set
                }, {returnOriginal: false}, function (err, cat) {
                    if (err) {
                        try {
                            res.send("Error updating: " + err);
                        } catch (er) {
                            console.log(er);
                        }
                    } else {
                        if (!cat) {
                            res.send("Not found");
                        } else {
                            if (user_access) {
                                res.send("Successfully updated");
                            }
                        }
                    }
                });
            }
        });
    }catch(err){
        let data = "Error in /updateCategory: " + err;
        console.log(data);
        res.send(data)
    }
});

//Delete a category
router.post('/deleteCategory', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Cat.deleteOne({_id:req.body._id}, function (err, cat) {
            if (err) {
                console.log(err);
                data.data = err;
            }else{
                if(!cat){
                    data.data = "Error deleting category";
                }else{
                    data.success = "1";
                    data.data = cat;
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /deleteCategory/:_id " + err;
        res.send(data)
    }
});

//Get unverified categories
router.get('/getUnverifiedCategories', function (req, res) {
    let data = {success: "0", data: '',verify:false};
    try {
        Cat.find({}, function (err, cats) {
            if (err) {
                console.log(err);
                data.data = err;
            }else{
                if(!cats){
                    data.data = "Error retrieving categories";
                }else{
                    data.success = "1";
                    data.data = cats;
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getUnverifiedCategories: " + err;
        res.send(data)
    }
});


//Get category
router.get('/getCategory/:id', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Cat.find({_id:req.params._id}, function (err, cat) {
            if (err) {
                console.log(err);
                data.data = err;
            }else{
                if(!cat){
                    data.data = "Error retrieving category";
                }else{
                    data.success = "1";
                    data.data = cat;
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getCategory/:_id " + err;
        res.send(data)
    }
});

//Get category by name
router.post('/getCategoryByTitle', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Cat.find({category:req.body.category}, function (err, cat) {
            if (err) {
                console.log(err);
                data.data = err;
            }else{
                if(!cat){
                    data.data = "Error retrieving category";
                }else{
                    data.success = "1";
                    data.data = cat;
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getCategoryByTitle " + err;
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
                data.data = err;
            }else{
                if(!cats){
                    data.data = "Error retrieving categories";
                }else{
                    data.success = "1";
                    data.data = cats;
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getCategories: " + err;
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

//FOR ADVERTISEMENTS

//Add new advertisement
router.post('/addAdvertisement',function (req, res) {
    try {
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                if(adminUser)
                    user_access = adminUser.access;
                let newAdvertisement = Advertisement();
                newAdvertisement.title = req.body.title;
                newAdvertisement.titleSearch = req.body.title.split(' ').map(k => k.toLowerCase());
                newAdvertisement.URL = req.body.URL;
                newAdvertisement.source = req.body.source;
                newAdvertisement.type = req.body.type;
                newAdvertisement.advertisementListCount = req.body.advertisementListCount;
                newAdvertisement.advertisementUrl = req.body.advertisementUrl;
                newAdvertisement.date = new Date().getTime() / 1000 + '';
                //Url to be shared
                newAdvertisement.uniqueUrl = newAdvertisement.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
                let date = newAdvertisement.date.split('.');
                newAdvertisement.uniqueUrl += date[0];
                newAdvertisement.description = req.body.description;
                newAdvertisement.shown = req.body.shown;
                if (user_access) {
                    newAdvertisement.verify = true;
                } else {
                    newAdvertisement.verify = false;
                }
                newAdvertisement.save(function (err, savedAdvertisement) {
                    if (err) {
                        try {
                            console.log(err);
                            res.send("Advertisement with same title already exists");
                        } catch (err) {
                            console.log(err);
                        }
                    }else{
                        console.log(savedAdvertisement);
                        res.send("Save success");
                    }
                });
            }

        });
    }catch (err){
        let data = "Error in /addAdvertisement: " + err;
        console.log(data);
        res.send(data);
    }

});

//Update advertisement
router.post('/updateAdvertisement',function (req, res) {
    try {
        let user_id = req.body.user_id;
        let user_access = 0;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error while finding user: " + err);
            } else {
                if(adminUser)
                    user_access = adminUser.access;
                let set;
                if (user_access) {
                    console.log("Admin is updating");
                    set = {
                        title: req.body.title,
                        titleSearch: req.body.title.split(' ').map(k => k.toLowerCase()),
                        advertisementListCount: req.body.advertisementListCount,
                        description : req.body.description,
                        URL : req.body.URL,
                        type : req.body.type,
                        advertisementUrl : req.body.advertisementUrl,
                        shown : req.body.shown,
                        verify: true
                    };
                } else {
                    set = {
                        title: req.body.title,
                        titleSearch: req.body.title.split(' ').map(k => k.toLowerCase()),
                        advertisementListCount: req.body.advertisementListCount,
                        description : req.body.description,
                        URL : req.body.URL,
                        type : req.body.type,
                        advertisementUrl : req.body.advertisementUrl,
                        shown : req.body.shown,
                        verify: false
                    };
                }

                Advertisement.findOneAndUpdate({_id: req.body._id}, {
                    $set: set
                }, {returnOriginal: true}, function (err, advertisement) {
                    if (err) {
                        try {
                            res.send("Error updating: " + err);
                        } catch (er) {
                            console.log(er);
                        }
                    }else{
                        console.log(advertisement);
                        res.send("Successfully updated");
                    }
                });
            }
        });
    }catch (err){
        let data = "Error in /updateAdvertisement: " + err;
        console.log(data);
        res.send(data);
    }
});

//Delete advertisement
//Delete a category
router.post('/deleteAdvertisement', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Advertisement.deleteOne({_id:req.body._id}, function (err, deletedAdvertisment) {
            if (err) {
                console.log(err);
                data.data = err;
            }else{
                if(!deletedAdvertisment){
                    data.data = "Error deleting advertisement";
                }else{
                    data.success = "1";
                    data.data = "Successfully deleted " + deletedAdvertisment.title;
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /deleteCategory/:_id " + err;
        res.send(data)
    }
});


//Get all advertisements - verified only - for users
router.get('/getAdvertisements',function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Advertisement.find({verify: true,shown:true}, function (err, advertisement) {
            if (err) {
                data.data = "Network error";
            } else {
                if(advertisement){
                    data.success = "1";
                    advertisement = sortJson(advertisement, 'advertisementListCount', 'asc');
                    data.data = advertisement;
                }else {
                    data.data = "Error in finding advertisements";
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getAdvertisements: " + err;
        console.log(data.data);
        res.send(data);
    }
});

//Get only unverified - for authors
router.get('/getUnverifiedAdvertisements',function (req, res) {
    let data = {success: "0", data: ''};
    try {
        Advertisement.find({verify: false}, function (err, advertisement) {
            if (err) {
                data.data = err;
            } else {
                if(advertisement){
                    data.success = "1";
                    advertisement = sortJson(advertisement, 'advertisementListCount', 'asc');
                    data.data = advertisement;
                }else {
                    data.data = "Error in finding advertisements";
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getUnverifiedAdvertisements: " + err;
        console.log(data.data);
        res.send(data);
    }
});

//Get verified advertisements - for authors
router.get('/getAllAdvertisements/:user_id', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.params.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in getAllAdvertisements/:user_id while finding user: " + err);
            } else {
                if(adminUser)
                    if (adminUser.access == 1) {
                    Advertisement.find({verify:true}, function (err, advertisement) {
                        if (err) {
                            console.log(err);
                            data.data = "Network error";
                            res.send(data);
                        }else{
                            if(advertisement){
                                data.success = "1";
                                advertisement = sortJson(advertisement, 'advertisementListCount', 'asc');
                                data.data = advertisement;
                            }
                            res.send(data);
                        }
                    });
                } else {
                    Advertisement.find({verify: false}, function (err, advertisement) {
                        let data = {success: "0", data: ''};
                        if (err) {
                            console.log(err);
                            data.data = "Network error";
                            res.send(data);
                        }else {
                            if (advertisement) {
                                data.success = "1";
                                advertisement = sortJson(advertisement, 'advertisementListCount', 'asc');
                                data.data = advertisement;
                            }
                            res.send(data);
                        }
                    });
                }
            }
        });
    }catch(err){
        data.data = "Error in /getAllAdvertisements/:user_id: " + err;
        console.log(data.data);
        res.send(data);
    }

});

//Get all polls
router.get('/getPolls',function (req, res) {
    let data = {success: "0", data: ''};
    try {
        News.find({type: "Poll", verify: true}, function (err, poll) {
            if (err) {
                data.data = err;
            } else {
                if(poll){
                    data.success = "1";
                    poll = sortJson(poll, 'date', 'des');
                    data.data = poll;
                }else {
                    data.data = "Error finding polls";
                }
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getPolls: " + err;
        console.log(data.data);
        res.send(data)
    }
});


//Increase poll counter
router.post('/pollCount',function (req, res) {
    let data = {success: "0", data: "", optionOneCount:0 , optionTwoCount:0};
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
                            data.success = "1";
                            data.data = "Already voted";
                            News.findOne({_id:newsId},function (err, savedPoll) {
                                data.optionOneCount = savedPoll.optionOneCount;
                                data.optionTwoCount = savedPoll.optionTwoCount;
                                res.send(data);
                            });
                        }
                    }
                });

            }
        });
    }catch(err){
        data.data = "Error in /pollCount: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get polled news by user
router.post("/getPoll",function (req, res) {
    let data = {success:"0",data:""};
    try {
        SavedPoll.find({username: req.body.username}, function (err, savedPolls) {
            if (err) {
                console.log(err);
                res.send(data);
            } else {
                data.success = "1";
                console.log(savedPolls);
                data.data = savedPolls;
                res.send(data);
            }
        });
    }catch(err){
        data.data = "Error in /getPoll: " + err;
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
                if(adminUser)
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
                if(req.body.category)
                newNews.tags = req.body.category.split(', ').map(k => k.toLowerCase());
                newNews.type = req.body.type;
                //If Poll
                newNews.question = req.body.question;
                newNews.optionOne = req.body.optionOne;
                newNews.optionTwo = req.body.optionTwo;
                newNews.optionOneCount = 0;
                newNews.optionTwoCount = 0;
                //Url to be shared
                newNews.uniqueUrl = newNews.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
                let date = newNews.date.split('.');
                newNews.uniqueUrl += date[0];
                if(newNews.type != "Advertisement"){
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
                }
                newNews.save(function (err, savedNews) {
                    if (err) {
                        try {
                            console.log(err);
                            res.send("News with same title already exists");
                        } catch (err) {
                            console.log(err);
                        }
                    }else{
                        //push notification
                        if (user_access) {
                            pushNotification(savedNews.title, savedNews.description, savedNews.imageURL, savedNews._id);
                        }
                        res.send("Save success");
                    }
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
                if(adminUser)
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
                        optionTwo: req.body.optionTwo,
                        subType:req.body.subType,
                        advertisementListCount:req.body.advertisementListCount
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
                        optionTwo: req.body.optionTwo,
                        subType:req.body.subType,
                        advertisementListCount:req.body.advertisementListCount
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
                                                if (cat.charAt(cat.length) == ',') {
                                                    cat = cat.substr(0, cat.length - 2);
                                                }
                                            }
                                        }
                                    }
                                });
                            });
                            if(user_access){
                                pushNotification(news.title,news.description,news.imageURL,news._id);
                            }
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
                if(adminUser)
                    user_access = adminUser.access;
                let verified = false;
                News.findOne({_id: req.body._id}, function (err, news) {
                    if (err) {
                        console.log("Finding news error: " + err);
                        data.data = "Finding news error: " + err;
                    } else {
                        if(news){
                            verified = news.verify;
                            if (user_access || !verified) {
                                let tags = "";
                                News.findOne({_id: req.body._id}, function (err, news) {
                                    if (err) {
                                        console.log(err);
                                        data.data = err;
                                    } else {
                                        //console.log("News = " + news);
                                        tags = news.category.split(', ');
                                        console.log("News tag: " + news.tags);
                                        News.deleteOne({_id: req.body._id}, function (err, results) {
                                            if (err) {
                                                console.log("Error: " + err);
                                                data.data = err;
                                            } else {
                                                if (tags != "") {
                                                    tags.forEach((category) => {
                                                        Cat.findOneAndUpdate({category: category}, {
                                                            $inc: {
                                                                count: -1
                                                            }
                                                        }, function (err, updatedCat) {
                                                            if (err) {
                                                                console.log("Error deleting category");
                                                                data.data = err;
                                                            } else {
                                                                data.success = "1";
                                                                data.data = "Deleted news and category";
                                                                if(updatedCat.count < 0){
                                                                    console.log("Working fine till here");
                                                                    Cat.findOneAndDelete({category: category});
                                                                }else{
                                                                }
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    console.log("Error deleting news");
                                                }

                                            }
                                        });
                                    }
                                });
                            } else {
                                data.data = "You don't have privilege for this action";
                            }
                        }else {
                            data.data = "No news found";
                        }
                    }
                });
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /deleteNews: " + err;
        console.log("Error while catching error");
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
            }else{
                data.success = "1";
                news = sortJson(news, 'date', 'des');
                data.data = news;
            }
            res.send(data);
        });
    }catch(err){
        data.data = "Error in /getNews: " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get unverified news - for authors
router.get('/getUnverifiedNews', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        News.find({verify: false}, function (err, news) {
            if (err) {
                console.log(err);
            }else{
                data.success = "1";
                news = sortJson(news, 'date', 'des');
                data.data = news;
            }
            res.send(data);
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
                if(adminUser)
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
router.post('/getNewsByCategory', function (req, res) {
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
        News.find({tags: req.body.category.toLowerCase(), verify: true}, {category: 0}, callback);
    }catch(err){
        data.data = "Error in /getNewsByCategory " + err;
        console.log(data.data);
        res.send(data)
    }
});

//Get news by url
router.get('/news/:url', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let newsCallback = (err, news) => {
            if (err) {
                console.info(err);
                res.send(data);
            } else {
                if(news){
                    console.log(req.params.url);
                    console.log(news);
                    data.success = "1";
                    data.data = news;
                    res.send(data);
                }
            }
        };
        News.find({uniqueUrl: req.params.url}, newsCallback);
    }catch(err){
        data.data = "Error in /news/:url: " + err;
        console.log(data.data);
        res.send(data)
    }
});



//Search news using title
router.post('/searchVerifiedNewsByTitle', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.body.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in searchNewsByTitle while finding user: " + err);
            } else {
                let searchCriteria;
                if(adminUser) {
                    if (adminUser.access == 1) {
                        searchCriteria = {titleSearch: {$regex: '^' + req.body.title},verify:true};
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
                            if (newsArray) {
                                data.success = "1";
                                data.data = newsArray;
                            } else {
                                data.data = "Error searching news via title";
                            }
                            res.send(data);
                        }
                    });
                }else{
                    data.data = "No admin user found";
                    res.send(data);
                }
            }
        });
    }catch(err){
        data.data = "Error in /searchNewsByTitle: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Search unverified news using title
router.post('/searchUnverifiedNewsByTitle', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.body.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in searchUnverifiedNewsByTitle while finding user: " + err);
            } else {
                let searchCriteria = {titleSearch: {$regex: '^' + req.body.title}, verify: false};
                if(adminUser)
                    News.find(searchCriteria, {
                    tags: 0,
                    titleSearch: 0,
                    url: 0,
                    source: 0,
                    date: 0,
                    count: 0,
                    category: 0
                }, function (err, newsArray) {
                    if (err) {
                        console.info(err);
                        res.send(data)
                    } else {
                        if(newsArray){
                            data.success = "1";
                            data.data = newsArray;
                        }else{
                            data.data = "Error searching news via title";
                        }
                        res.send(data);
                    }
                });
            }
        });
    }catch(err){
        data.data = "Error in /searchUnverifiedNewsByTitle: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Get advertisement by url

router.get('/advertisement/:url',function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let advertisementCallback = (err, advertisement) => {
            if (err) {
                console.info(err);
                res.send(data);
            } else {
                if(advertisement){
                    console.log(req.params.url);
                    console.log(advertisement);
                    data.success = "1";
                    data.data = advertisement;
                    res.send(data);
                }
            }
        };
        Advertisement.find({uniqueUrl: req.params.url}, advertisementCallback);
    }catch(err){
        data.data = "Error in /news/:url: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Search advertisement using title
router.post('/searchAdvertisementByTitle', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.body.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in searchAdvertisementByTitle while finding user: " + err);
            } else {
                let searchCriteria;
                if(adminUser) {
                    if (adminUser.access == 1) {
                        searchCriteria = {titleSearch: {$regex: '^' + req.body.title}};
                    } else {
                        searchCriteria = {
                            type: "Advertisement",
                            titleSearch: {$regex: '^' + req.body.title},
                            verify: false
                        };
                    }
                    Advertisement.find(searchCriteria, {
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
                }else{
                    data.data = "No admin user found";
                    res.send(data);
                }
            }
        });
    }catch(err){
        data.data = "Error in /searchAdvertisementByTitle: " + err;
        console.log(data.data);
        res.send(data)
    }

});

//Search unverified advertisement using title
router.post('/searchUnverifiedAdvertisementByTitle', function (req, res) {
    let data = {success: "0", data: ''};
    try {
        let user_id = req.body.user_id;
        Admin.findOne({_id: user_id}, function (err, adminUser) {
            if (err) {
                console.log("Error in searchUnverifiedAdvertisementByTitle while finding user: " + err);
            } else {
                let searchCriteria = {titleSearch: {$regex: '^' + req.body.title}, verify: false};
                if(adminUser)
                    Advertisement.find(searchCriteria, {
                    tags: 0,
                    titleSearch: 0,
                    url: 0,
                    tagPrimary: 0,
                    tagSecondary: 0,
                    source: 0,
                    date: 0,
                    count: 0,
                    category: 0
                }, function (err, advertisementArray) {
                    if (err) {
                        console.info(err);
                        res.send(data)
                    } else {
                        if(advertisementArray){
                            data.success = "1";
                            data.data = advertisementArray;
                        }else{
                            data.data = "Error searching news via title";
                        }
                        res.send(data);
                    }
                });
            }
        });
    }catch(err){
        data.data = "Error in /searchUnverifiedAdvertisementByTitle: " + err;
        console.log(data.data);
        res.send(data)
    }

});


//Get news by id
router.post('/getNewsById',function (req,res) {
    let data = {success: "0", data: ''};
    try {
        News.findOne({_id: req.body.news_id}, {titleSearch: 0, count: 0}, function (err, news) {
            if (err) {
                data.data = "Please fill news_id";
                res.send(data);
            } else {
                if(news){
                    data.data = news;
                    data.success = 1;
                }else{
                    data.data = "No news found by this id";
                }
                res.send(data);
            }
        });
    }catch(err){
        data.data = "Error in /getNewsById : " + err;
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
               if(news){
                   data.data = news;
                   data.success = 1;
               }else{
                   data.data = "Error finding using title";
               }
               res.send(data);
           }
       });
   }catch(err){
       data.data = "Error in /getNewsByTitle : " + err;
       console.log(data.data);
       res.send(data)
   }
});

//Get advertisement by title
router.post('/getAdvertisementByTitle',function (req,res) {
    let data = {success: "0", data: ''};
    try {
        Advertisement.findOne({title: req.body.title}, {titleSearch: 0, date: 0, count: 0}, function (err, advertisement) {
            if (err) {
                res.send(data);
            } else {
                if(advertisement){
                    data.data = advertisement;
                    data.success = 1;
                }else {
                    data.data = "Error find adv by title";
                }
                res.send(data);
            }
        });
    }catch(err){
        data.data = "Error in /getAdvertisementByTitle : " + err;
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

