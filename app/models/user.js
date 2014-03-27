<<<<<<< HEAD
module.exports = function (Schema, mongoose) {
  var UserSchema = new Schema({
    local         : {
      email       : { type: String },
      password    : { type: String }
    },
    facebook      : {
      id          : { type: String },
      token       : { type: String },
      email       : { type: String },
      name        : { type: String }
    },
    twitter       : {
      id          : { type: String },
      token       : { type: String },
      displayName : { type: String },
      username    : { type: String }
    },
    org           : { type: Schema.ObjectId },
    loc           : { type: {type: String}, coordinates: [] },
    lastLoc       : { type: Date },
    session       : { type: String }
  });
  return mongoose.model('User', UserSchema);
};
=======
'use strict';

//app/models/user.js

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  local          : {
    email        : String,
    password     : String,
  },
  facebook       : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  twitter        : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
  org: { type: Schema.ObjectId },
  loc: { type: {type: String}, coordinates: [] },
  lastloc: { type: Date },
  session: { type: String }

});


userSchema.index({loc: '2dsphere'});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
>>>>>>> a43ab7490fbdd9a0b2665cea9fd1cf50dcd0fc56
