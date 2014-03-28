'use strict';

/* Import node modules */
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');

/* Configuration */
app.configure(function () {
  app.use(express.json());
  app.use(express.cookieParser());
  app.use('/public', express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('production', function(){
  mongoose.connect('localhost', 'missout');
});
app.configure('development', function(){
  mongoose.connect('localhost', 'missout-dev');
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});
app.configure('test', function(){
  mongoose.connect('localhose', 'missout-test');
});

/* Render the index */
app.get('/', function (req, res) {
  res.sendfile('app/views/index.html');
});




///* Save a new geoMessage from form */
//app.post('/', function (req, res) {
//  var msg = new Message({
//    body: req.body.msg,
//    loc: {
//      type: 'Point',
//      coordinates: [ parseFloat(req.body.lon), parseFloat(req.body.lat) ]
//    }
//  });
//  msg.save(function (err, msg) {
//    if (err) {
//      res.send(err);
//    } else {
//      //res.send(msg);
//      Message.find({
//        loc: {
//          $nearSphere: msg.loc.coordinates,
//          $maxDistance: 0.01
//        }
//      },
//      function (err, docs) {
//        if (err) {
//          res.send(err);
//        }
//        res.send(docs);
//      });
//    }
//  });
//});

/* Hey! Listen! */
var port = process.env.PORT || process.argv[2] || 5000;
app.listen(port, function () {
  console.log('Listening on ' + port);
});
