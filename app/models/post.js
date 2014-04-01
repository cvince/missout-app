'use strict';

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var CommentSchema = new Schema({
  author    : { type: Schema.ObjectId },
  body      : { type: String },
  timestamp : { type: Date },
  tempname  : { type: String }
});

var Comment = mongoose.model('Comment', CommentSchema);

var PostSchema = new Schema({
  timestamp : { type: Date },
  loc       : { type: { type: String }, coordinates: [] },
  author    : { type: Schema.ObjectId },
  body      : { type: String },
  comments  : [ Comment ],
  tempname  : { type: String },
  tempnames : [{ type: String }]
});

PostSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);
