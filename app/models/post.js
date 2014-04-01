'use strict';

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var CommentSchema = mongoose.Schema({
  author    : { type: Schema.ObjectId },
  body      : { type: String },
  timestamp : { type: Date },
  tempname  : { type: String }
});

var Comment = mongoose.model('Comment', CommentSchema);

var PostSchema = mongoose.Schema({
  timestamp : { type: Date },
  loc       : { type: { type: String }, coordinates: [] },
  author    : { type: Object },
  body      : { type: String },
  comments  : [ Comment ],
  tempname  : { type: String },
  tempnames : [{ type: String }]
});

PostSchema.methods.makeAuthor = function(id){
  this.author = id;
};

module.exports = mongoose.model('Post', PostSchema);
