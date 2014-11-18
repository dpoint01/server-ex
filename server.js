// Express initialization
var express = require('express');
var app = express();

//var bodyParser = require('body-parser');
//var validator = require('validator');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'https://fathomless-wildwood-2612.herokuapp.com/;'
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>Hey, it works!</p>');
   //Home, the root, the index in HTML. You may also use additional JavaScript
   //and CSS, and you are free to design this page however you desire.
   //Accessing this on a web browser shall display list of all the check-ins for
   //all logins sorted in descending order by timestamp. Login and check-in
   //timestamps must be displayed in addition to the location (latitude and
   //longitude). Simply outputting JSON is unacceptable.
});


/*
app.post('/sendLocation', function (request, response) {

});

app.get('/locations.json', function (request, response) {

});

app.get('/redline.json', function (request, response) {


});
*/


app.listen(process.env.PORT || 3000);
