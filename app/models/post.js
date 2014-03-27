'use strict';

//app/models/post.js

var mongoose = require('mongoose');

var PostSchema = new Schema({
  timestamp: { type: Date },
  loc: { type: Point, coordinates: [] },
  org: { type: Schema.ObjectID },
  author: { type: Schema.ObjectID },
  body: { type: String },
  comments: [ Comment ],
  tempname: { type: String }
});

module.exports = mongoose.model('Post', PostSchema);
