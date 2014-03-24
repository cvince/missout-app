'use strict';

//app/models/message.js

var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  meta          : {
    time        : String,
    content     : String,
    user        : String
  }
})

module.exports = mongoose.model('Post', postSchema);
