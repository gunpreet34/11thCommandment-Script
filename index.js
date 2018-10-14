var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Connect to MongoDB MLAb
mongoose.connect('mongodb://gunpreet.34:grass80_@ds131313.mlab.com:31313/commandment-db', { useNewUrlParser: true });

//express object
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Get request
app.use('/',require('./routes'));

//listen
app.listen(27015);
console.log('Server is up and running');