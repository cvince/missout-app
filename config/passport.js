'use strict';

// config/passport.js
var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var User                = require('../app/models/user');

var configAuth          = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  //local login

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.email' : email }, function(err, user){
        if(err)
          return done(err);
        if(user){
          return done(null, false, req.flash('signupMessage', 'that email is already taken'));
        }else{
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err){
            if(err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    User.findOne({ 'local.email': email }, function(err, user){
      if(err){
        return done(err);
      }
      if(!user){
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      if(!user.validPassword(password)){
        return done(null, false, req.flash('loginMessage', 'oops! Wrong Password'));
      }
      return done(null, user);
    });
  }));


  //facebook login

  passport.use(new FacebookStrategy({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL
  },

  function(req, token, refreshToken, profile, done){
    process.nextTick(function(){

      if(!req.user){

        User.findOne({ 'facebook.id' : profile.id }, function(err, user){
          if(err){
            return done(err);
          }
          if(user){
            return done(null, user);
          }else{
            var newUser = new User();

            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function(err){
              if(err){
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      } else {
        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session

        // update the current users facebook credentials
        user.facebook.id    = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
        user.facebook.email = profile.emails[0].value;

        // save the user
        user.save(function(err) {
          if (err) { throw err; }
          return done(null, user);
        });
      }
    });
  }));

  //twitter login
  passport.use(new TwitterStrategy({

    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL

  },
  function(token, tokenSecret, profile, done) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {

      User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser                 = new User();

            // set all of the user data that we need
            newUser.twitter.id          = profile.id;
            newUser.twitter.token       = token;
            newUser.twitter.username    = profile.username;
            newUser.twitter.displayName = profile.displayName;

            // save our user into the database
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        }
      );
    });
  }));
};
