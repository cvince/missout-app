'use strict';

var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;


var CommentSchema = new Schema({
  author    : { type: Object },
  body      : { type: String },
  timestamp : { type: Date },
  tempname  : { type: String }
});

var Comment = mongoose.model('Comment', CommentSchema);

var PostSchema = new Schema({
  timestamp : { type: Date },
  loc       : { type: { type: String, default: "Point" }, coordinates: [] },
  author    : { type: Object },
  body      : { type: String },
  comments  : [ Comment ],
  tempname  : { type: String }
  //tempnames : [{ type: String }]
});


PostSchema.methods.makeAuthor = function(id){
  this.author = id;
};

PostSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);
