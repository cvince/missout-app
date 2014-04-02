'use strict';

//app/models/user.js

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({

  local          : {
    email        : String,
    password     : String
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
  //loc: { type: {type: String}, coordinates: [] },
  lastloc: { type: Date },
  session: { type: String }

});


UserSchema.index({loc: '2dsphere'});

UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
