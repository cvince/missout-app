'use strict';

var express     = require('express.io');
var cons        = require('consolidate');
var app         = express().http().io();
var port        = process.env.PORT || 8888;
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');
var configDB    = require('./config/database.js');


//helper modules
var Meta        = require('./app/helpers/meta');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.configure(function(){

  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());

  app.engine('html', cons.handlebars);
  app.set('view engine', 'html');

  app.use(express.session({secret: process.env.CHAT_APP_SECRET}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

});


//routes
require('./app/routes.js')(app, passport);

//sockets

var Post = require('./app/models/message');

app.io.route('connect', function(req){
  console.log('yay online!');
  var fetch = [];
  Post.find({}, {meta: 1, _id: 0}, function(err, posts) {
    if(err) {
      return err;
    } else {
      fetch = posts;
      for(var i in fetch){
          if(fetch[i].meta.user&&fetch[i].meta.content){
          var update = { uid: String, message: String};
          update.uid = fetch[i].meta.user;
          update.message = fetch[i].meta.content;
          req.io.emit('update-tiles', update);
        }
      }
    }
  });
  // req.io.emit('update-tiles')
});


app.io.route('send-post', function(req){
  console.log(req.data);
  req.io.broadcast('update-tiles', req.data);
  req.io.emit('update-tiles', req.data);
  var postMeta = new Meta();
  var newPost = new Post();

  console.log(newPost);

  newPost.meta.timePassed = postMeta.getDate();
  newPost.meta.timePosted = postMeta.getTime();
  newPost.meta.content = req.data.message;
  newPost.meta.user = req.data.uid;
  newPost.meta.location = postMeta.getLocation();

  console.log(newPost);

  newPost.save(function (err) {
    if (!err) {
      return console.log('new post saved to DB');
    } else {
      return console.log(err);
    }
  });

});


//listen
app.listen(port);
console.log('online at port '+port);
