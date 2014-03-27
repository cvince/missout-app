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
    loc           : { type: { type: String }, coordinates: [] },
    lastLoc       : { type: Date },
    session       : { type: String }
  });
  return mongoose.model('User', UserSchema);
};