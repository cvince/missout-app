'use strict';

//app/models/comment.js

var mongoose = require('mongoose');

var CommentSchema = new Schema({
  author: { type: Schema.ObjectID },
  body: { type: String },
  timestamp: { type: Date },
  tempname: { type: String }
});


module.exports = mongoose.model('Comment', CommentSchema);
