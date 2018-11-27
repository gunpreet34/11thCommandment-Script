var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Connect to MongoDB MLAb
mongoose.connect('mongodb://gunpreet.34:grass80_@ds131313.mlab.com:31313/commandment-db', { useNewUrlParser: true });

//express object
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');
//Get request
app.use('/',require('./routes'));

//listen
app.listen(process.env.PORT || 3000);
console.log('Server is up and running');