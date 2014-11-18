// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function(error, databaseConnection) {
  db = databaseConnection;
});

//Allow cross domain access
app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//-------------------------------------GET HOME-----------------------------------//
app.get('/', function (req, res, next) {
  res.set('Content-Type', 'text/html');
  var indexPage = ''
  db.collection('locations', function(er, collection) {
    collection.find().toArray(function(err, cursor) {
      if (!err) {
        indexPage += "<!DOCTYPE HTML><html><head><title>List of All Check-ins</title></head><body><h1>Check-ins: </h1>";
        for (var i = 0; i < cursor.length; i++) {
          indexPage += "<p>" + i + ".  "+ cursor[i].login + " checked-in @: " + "|| " + " latitude: "
                             + cursor[i].lat + " longitude: " + cursor[i].lng + "  || " + " (" +
                             cursor[i].created_at + ")</p>";
        }
        indexPage += "</body></html>"
        res.send(indexPage);
      } else {
        res.send('<!DOCTYPE HTML><html><head><title>List of All Check-ins</title></head><body><h1>Something went wrong...</h1></body></html>');
      }
    });
  });
});

//---------------------------------POST SENDLOCATION-----------------------------//
app.post('/sendLocation', function(req, res, next) {
  var login = req.body.login;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var created_at = new Date();

  var toInsert = {
      "login": login,
      "lat": lat,
      "lng": lng,
      "created_at": created_at,
  };

  if(login == undefined || lat == undefined || lng == undefined){
    res.send("missing some fields");
  }
  else {
    db.collection('locations', function(er, collection) {
      var id = collection.insert(toInsert, function(err, saved) {
        if (err) {
          res.send(500);
        }
        else {
          students = db.locations.find();
          characters = [];
          res.send(JSON.stringify(characters, students));
          res.send(200);
        }
        });
    });
  }
});



app.listen(process.env.PORT || 3000);
