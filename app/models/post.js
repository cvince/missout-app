module.exports = function (Schema, mongoose) {
  var CommentSchema = new Schema({
    author    : { type: Schema.ObjectID },
    body      : { type: String },
    timestamp : { type: Date },
    tempname  : { type: String }
  });
  var Comment = mongoose.model('Comment', CommentSchema);
  var PostSchema = new Schema({
    timestamp : { type: Date },
    loc       : { type: Point, coordinates: [] },
    org       : { type: Schema.ObjectID },
    author    : { type: Schema.ObjectID },
    body      : { type: String },
    comments  : [ Comment ],
    tempname  : { type: String }
  });
  return mongoose.model('Post', PostSchema);
};