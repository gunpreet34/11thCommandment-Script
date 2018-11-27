let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

//Connect to MongoDB MLAb
try{
    mongoose.connect('mongodb://gunpreet.34:grass80_@ds131313.mlab.com:31313/commandment-db', { useNewUrlParser: true });
}catch(err){
    console.log(err);
}

//express object
let app = express();

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