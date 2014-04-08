'use strict';

var mongoose    = require('mongoose');
var nameGen     = require ('../tempName.js');
var Schema      = mongoose.Schema;


var CommentSchema = new Schema({
  author    : { type: Object },
  body      : { type: String },
  timestamp : { type: Date },
  tempname  : { type: String }
});

var Comment = mongoose.model('Comment', CommentSchema);

var PostSchema = new Schema({
  title     : { type: String },
  timestamp : { type: Date },
  loc       : { type: { type: String, default: "Point" }, coordinates: [] },
  author    : { type: Object },
  body      : { type: String },
  comments  : [{
    author    : { type: Object },
    body      : { type: String },
    timestamp : { type: Date },
    tempname  : { type: String }
  }],
    tempname  : { type: String }
    //tempnames : [{ type: String }]
});



PostSchema.methods.makeAuthor = function(id){
  this.author = id;
  this.tempname = nameGen(); //post-specific temp-name generator output here
};



PostSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);
