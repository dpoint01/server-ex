// Express initialization
var express = require('express');
var app = express();

// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
    "https://fathomless-wildwood-2612.herokuapp.com/;"
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  response.send('<p>Hey, it works!</p>');
});

app.post('/sendlocation', function(request, response) {
  var fooditem = request.body.fooditem;
  var toInsert = {
    "fooditem": fooditem,
  };
  db.collection('fooditems', function(er, collection) {
    var id = collection.insert(toInsert, function(err, saved) {
      if (err) {
        response.send(500);
      }
      else {
        response.send(200);
      }
      });
  });
});



app.listen(process.env.PORT || 3000);
