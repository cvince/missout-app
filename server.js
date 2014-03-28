/* Import node modules */
var express = require('express'),
    mongoose = require('mongoose'),
    cons = require('consolidate'),
    passport = require('passport'),
    flash = require('connect-flash'),
    app = express();

/* Configuration */
app.configure(function () {
  app.use(express.bodyParser());
  app.set('views', __dirname + '/app/views');
  app.use('/public', express.static(__dirname + '/public'));

  //handlebars engine
  app.engine('html', cons.handlebars);
  app.set('view engine', 'html');


  //authentication uses
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({secret: process.env.CHAT_APP_SECRET}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
});

/* Connect to db */
mongoose.connect('localhost', 'missout');

/* Passport Strategies */
require('./app/passport/passport')(passport);

/* Get Routes */
require('./app/routes/authenticate')(app, passport);

/* Render the index */
// app.get('/', function (req, res) {
//   res.sendfile('app/views/index.html');
// });




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
var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('Listening on ' + port);
});
