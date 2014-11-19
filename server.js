//-----------------------------------Initialization--------------------------------//
var http = require('http');
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
/*
app.all('*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});*/

//-------------------------------------GET HOME-----------------------------------//
app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  var indexPage = ''
  db.collection('locations', function(er, collection) {
    collection.find().sort({'created_at': -1 }).toArray(function(err, cursor) {
      if (!err) {
        indexPage += "<!DOCTYPE HTML><html><head><title>List of All Check-ins</title></head><body><h1>Check-ins: </h1>";
        for (var i = 0; i < cursor.length; i++) {
          var num = i+1;
          indexPage += "<p>" + num + ".  "+ "<strong>" + cursor[i].login + "</strong>" + " checked-in @: " + "|| " + " latitude: "
                             + cursor[i].lat + " longitude: " + cursor[i].lng + "  || " + " (" +
                             cursor[i].created_at + ")</p>";
        }
        indexPage += "</body></html>";
        res.send(indexPage);
      } else {
        res.send('<!DOCTYPE HTML><html><head><title>List of All Check-ins</title></head><body><h1>Something went wrong...</h1></body></html>');
      }
    });
  });
});

//--------------------------------GET Locations.JSON-----------------------------//
app.get('/locations.json', function (req, res) {
  //Cross Domain Access
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  res.set('Content-Type', 'text/html');
  var login = req.query.login;

  if(login == undefined){
    res.send("[] (empty list)");
  }
  else {
    db.collection('locations', function(er, collection) {
      collection.find({"login": login}).sort({'created_at': -1 }).toArray(function(err, cursor) {
        if (!err) {
          string = JSON.stringify(cursor);
          res.send(string);
        }
        else {
          res.send("did not connect to db");
          res.send(500);
        }
      });
    });
  }

});

//---------------------------------POST SENDLOCATION-----------------------------//
app.post('/sendLocation', function(req, res) {
  //Cross Domain Access
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var login = req.body.login;
  var lat = req.body.lat;
  var lng = req.body.lng;
  var created_at = new Date();

  //change string to float lat/lng
  var parsed_lat = parseFloat(lat);
  var parsed_lng = parseFloat(lng);

  var toInsert = {
      "login": login,
      "lat": parsed_lat,
      "lng": parsed_lng,
      "created_at": created_at,
  };

  if(login == undefined || lat == undefined || lng == undefined){
    res.send("missing some fields");
  }
  else {
    db.collection('locations', function(er, collection) {
      collection.find().toArray(function(err, cursor) {
        if(!err){
          var id = collection.insert(toInsert, function(err, saved) {
            if (err) {
              res.send(500);
            }
            else {
              characters = [];
              collection.find().sort({'created_at': -1 }).limit(100).toArray(function(err, cursor){
                if(!err) {
                 res.send(JSON.stringify({"characters": characters, "students": cursor}));
                }
                else {
                  res.send(500);
                }
              });
            }
          });
        }
      });
    });
  }
});

//---------------------------------------REDLINE JSON----------------------------------------//
app.get('/redline.json', function(request, response) {
  //Cross Domain Access
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");

  var data = '';
  http.get("http://developer.mbta.com/lib/rthr/red.json", function(apiresponse) {
    apiresponse.on('data', function(chunk) {
      data += chunk;
    });
    apiresponse.on('end', function() {
      response.send(data);
    });
  }).on('error', function(error) {
      response.send(500);
    });
});



app.listen(process.env.PORT || 3000);
